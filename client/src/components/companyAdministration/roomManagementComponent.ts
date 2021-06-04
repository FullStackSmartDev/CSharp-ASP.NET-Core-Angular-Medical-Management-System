import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { DataService } from '../../provider/dataService';
import { TableNames } from '../../constants/tableNames';
import { ToastService } from '../../provider/toastService';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { Room } from '../../dataModels/room';
import { RoomDataService, AppointmentDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LoadPanelService } from '../../provider/loadPanelService';
import { ExtraFieldsAppService } from '../../provider/appServices/extraFieldsAppService';
import { RoomViewDataService } from '../../provider/dataServices/read/readDataServices';
import { ExtraFieldsTabComponent } from './extraFieldsTabComponent';
import CustomStore from 'devextreme/data/custom_store';
import { alert } from 'devextreme/ui/dialog';
import { Appointment } from '../../dataModels/appointment';
import { confirm } from 'devextreme/ui/dialog';

@Component({
    templateUrl: 'roomManagementComponent.html',
    selector: 'room-management'
})

export class RoomManagementComponent extends BaseComponent implements AfterViewInit {
    @ViewChild("roomDataGrid") roomDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateRoomPopup") createUpdateRoomPopup: DxPopupComponent;
    @ViewChild("roomCreationForm") roomCreationForm: DxFormComponent;
    //@ViewChild("extraFieldsTab") extraFieldsTab: ExtraFieldsTabComponent;

    roomDataSource: any = {};
    locationDataSource: any = {};

    selectedRooms: Array<any> = [];

    room: Room = new Room();
    isNewRoom: boolean = true;
    isRoomSet: boolean = false;
    isCreateUpdatePopupOpened: boolean = false;

    constructor(dataService: DataService, toastService: ToastService,
        private lookupDataSourceProvider: LookupDataSourceProvider,
        private extraFieldsAppService: ExtraFieldsAppService,
        private roomDataService: RoomDataService,
        private loadPanelService: LoadPanelService,
        private roomViewDataService: RoomViewDataService,
        private appointmentDataService: AppointmentDataService) {
        super(dataService, toastService);

        this.init();
    }

    // onExtraFieldsTabCreated($event) {
    //     if ($event) {
    //         this.roomCreationForm.items[0]["tabs"].push($event);
    //         this.roomCreationForm.instance.repaint();
    //     }
    // }

    openRoomCreationForm() {
        this.isCreateUpdatePopupOpened = true;
        this.isRoomSet = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateRoomForm();
    }

    createUpdateRoom() {
        const validationResult = this.roomCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.loadPanelService
            .showLoader();

        const createUpdateRoomPromise = this.isNewRoom
            ? this.roomDataService.create(this.room)
            : this.roomDataService.update(this.room);

        createUpdateRoomPromise
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.roomDataGrid.instance.refresh();
                this.resetCreateUpdateRoomForm();
                this.isCreateUpdatePopupOpened = false;

                this.loadPanelService.hideLoader();

                this.toastService
                    .showSuccessMessage("Room was updated successfuly");
            })
            .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
    }

    ngAfterViewInit(): void {
        this.createUpdateRoomPopup
            .instance.registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });

        // this.extraFieldsAppService
        //     .addExtraColumnsToGridIfNeeded(TableNames.room, this.roomDataGrid);
    }

    deleteRoom(room: any, $event: any) {
        $event.stopPropagation();

        this.loadPanelService
            .showLoader();

        const roomId = room.Room_Id;

        this.canDeactivateDeleteRoom(roomId)
            .then(canDelete => {
                this.loadPanelService
                    .hideLoader();

                if (!canDelete) {
                    alert("Room already is used. You cannot delete it.", "WARNING");
                    return;
                }

                this.continueDeletingRoom(roomId);
            });
    }

    onRoomFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewRoom && dataField === "IsActive" && !$event.value) {
            this.loadPanelService.showLoader();

            const locationId = this.room.Id;
            this.canDeactivateDeleteRoom(locationId)
                .then(canDeactivate => {
                    this.loadPanelService.hideLoader();

                    if (!canDeactivate) {
                        this.room.IsActive = true;
                        alert("Room already is used. You cannot deactivate it.", "WARNING");
                    }
                });
        }
    }

    onRoomSelected($event) {
        const selectedRoom = $event.selectedRowsData[0];
        if (!selectedRoom) {
            return;
        }

        const selectedRoomId = $event.selectedRowsData[0].Room_Id;
        this.roomDataService.getById(selectedRoomId)
            .then((room) => {
                this.room = room;
                this.isNewRoom = false;
                this.isRoomSet = true;
                this.isCreateUpdatePopupOpened = true;
            })
            .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
    }

    private canDeactivateDeleteRoom(roomId: string): Promise<boolean> {
        return this.getAppointmentByRoomIdPromise(roomId)
            .then(appointment => {
                return !appointment;
            });
    }

    private getAppointmentByRoomIdPromise(roomId: string): Promise<Appointment> {
        const loadOptions = {
            filter: ["RoomId", "=", roomId]
        }

        return this.appointmentDataService
            .firstOrDefault(loadOptions)
    }

    private continueDeletingRoom(roomId: string): void {
        const confirmationPopup = confirm("Are you sure you want to delete the room ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.loadPanelService
                    .showLoader();

                const filter = `WHERE Id = '${roomId}'`;

                this.roomDataService.getById(roomId)
                    .then((templateLookupItem) => {
                        this.roomDataService.delete(filter, templateLookupItem)
                            .then(() => {
                                this.roomDataGrid
                                    .instance.refresh();

                                this.loadPanelService
                                    .hideLoader();
                            });
                    });
            }
        });
    }

    private resetCreateUpdateRoomForm() {
        this.room = new Room();
        this.isRoomSet = false;
        this.isNewRoom = true;
        this.selectedRooms = [];
    }

    private init(): any {
        this.initRoomDataSource();
        this.initLocationDataSource();
    }

    private initRoomDataSource(): void {
        this.roomDataSource.store =
            new CustomStore({
                byKey: (key) => {
                    return this.roomDataService
                        .getById(key);
                },
                load: (loadOptions: any) => {
                    return this.roomViewDataService
                        .searchWithCount(loadOptions, "Room_Id");
                }
            });
        // this.extraFieldsAppService
        //     .getExtraFieldDataSource(this.roomViewDataService, TableNames.room, "Room_Id");
    }

    private initLocationDataSource(): void {
        this.locationDataSource.store = this.lookupDataSourceProvider
            .locationLookupDataSource;
    }
}