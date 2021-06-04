import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { Room } from 'src/app/administration/models/room';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { RoomService } from 'src/app/administration/services/room.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: 'room',
    templateUrl: './room.component.html'
})
export class RoomComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("roomDataGrid", { static: false }) roomDataGrid: DxDataGridComponent;
    @ViewChild("roomPopup", { static: false }) roomPopup: DxPopupComponent;
    @ViewChild("roomForm", { static: false }) roomForm: DxFormComponent;
    //@ViewChild("extraFieldsTab") extraFieldsTab: ExtraFieldsTabComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    roomDataSource: any = {};
    locationDataSource: any = {};

    selectedRooms: Array<any> = [];

    room: Room = new Room();
    isNewRoom: boolean = true;
    isRoomSet: boolean = false;
    isRoomPopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private roomService: RoomService,
        private appointmentService: AppointmentService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService
        //private extraFieldsAppService: ExtraFieldsAppService,
    ) {

        super();
        this.init();
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    // onExtraFieldsTabCreated($event) {
    //     if ($event) {
    //         this.roomCreationForm.items[0]["tabs"].push($event);
    //         this.roomCreationForm.instance.repaint();
    //     }
    // }

    openRoomForm() {
        this.isRoomPopupOpened = true;
        this.isRoomSet = true;
    }

    onRoomPopupHidden() {
        this.resetCreateUpdateRoomForm();
    }

    createUpdateRoom() {
        const validationResult = this.roomForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.roomService.save(this.room)
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.roomDataGrid.instance.refresh();
                this.resetCreateUpdateRoomForm();
                this.isRoomPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.roomPopup);

        // this.extraFieldsAppService
        //     .addExtraColumnsToGridIfNeeded(TableNames.room, this.roomDataGrid);
    }

    deleteRoom(room: any, $event: any) {
        $event.stopPropagation();

        const roomId = room.id;

        this.canDeactivateDeleteRoom(roomId)
            .then(canDelete => {

                if (!canDelete) {
                    this.alertService.warning("Room already is used. You cannot delete it.");
                    return;
                }

                this.continueDeletingRoom(roomId);
            });
    }

    onRoomFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewRoom && dataField === "isActive" && !$event.value) {

            const locationId = this.room.id;
            this.canDeactivateDeleteRoom(locationId)
                .then(canDeactivate => {

                    if (!canDeactivate) {
                        this.room.isActive = true;
                        this.alertService.warning("Room already is used. You cannot deactivate it.");
                    }
                });
        }
    }

    onRoomSelected($event) {
        const selectedRoom = $event.selectedRowsData[0];
        if (!selectedRoom) {
            return;
        }

        const selectedRoomId = $event.selectedRowsData[0].id;
        this.roomService.getById(selectedRoomId)
            .then((room) => {
                this.room = room;
                this.isNewRoom = false;
                this.isRoomSet = true;
                this.isRoomPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private canDeactivateDeleteRoom(roomId: string): Promise<boolean> {
        return this.appointmentService.getByRoomId(roomId)
            .then(appointment => {
                return !appointment;
            });
    }

    private continueDeletingRoom(roomId: string): void {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the room ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {

                this.roomService.delete(roomId)
                    .then(() => {
                        this.roomDataGrid.instance.refresh();
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
        this.roomDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("room"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
        // this.extraFieldsAppService
        //     .getExtraFieldDataSource(this.roomViewDataService, TableNames.room, "Room_Id");
    }

    // private initLocationDataSource(): void {
    //     this.locationDataSource.store = createStore({
    //         loadUrl: this.dxDataUrlService.locationLookupUrl
    //     });
    // }

    private initLocationDataSource(): void {
        this.locationDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("location"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.roomDataGrid && this.roomDataGrid.instance)
                        this.roomDataGrid.instance.refresh();
                }
            });
    }
}