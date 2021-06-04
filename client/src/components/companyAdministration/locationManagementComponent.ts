import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { DataService } from '../../provider/dataService';
import { ToastService } from '../../provider/toastService';
import { LocationDataService, AppointmentDataService, RoomDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { Location } from '../../dataModels/location';
import { LoadPanelService } from '../../provider/loadPanelService';
import { ExtraFieldsTabComponent } from './extraFieldsTabComponent';
import { TableNames } from '../../constants/tableNames';
import { ExtraFieldsAppService } from '../../provider/appServices/extraFieldsAppService';
import CustomStore from 'devextreme/data/custom_store';
import { alert } from 'devextreme/ui/dialog';
import { Room } from '../../dataModels/room';
import { Appointment } from '../../dataModels/appointment';
import { CompanyIdService } from '../../provider/companyIdService';
import { confirm } from 'devextreme/ui/dialog';

@Component({
    templateUrl: 'locationManagementComponent.html',
    selector: 'location-management'
})

export class LocationManagementComponent extends BaseComponent implements AfterViewInit {
    @ViewChild("locationCreationForm") locationCreationForm: DxFormComponent;
    @ViewChild("locationDataGrid") locationDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateLocationPopup") createUpdateLocationPopup: DxPopupComponent;
    //@ViewChild("extraFieldsTab") extraFieldsTab: ExtraFieldsTabComponent;

    locationDataSource: any = {};
    location: Location = new Location();

    selectedLocations: Array<any> = [];

    isCreateUpdatePopupOpened: boolean = false;

    isNewLocation: boolean = true;
    isLocationSet: boolean = false;

    constructor(dataService: DataService, toastService: ToastService,
        private locationDataService: LocationDataService,
        private loadPanelService: LoadPanelService,
        private extraFieldsAppService: ExtraFieldsAppService,
        private appointmentDataService: AppointmentDataService,
        private roomDataService: RoomDataService,
        private companyIdService: CompanyIdService) {
        super(dataService, toastService);

        this.init();
    }

    ngAfterViewInit() {
        this.createUpdateLocationPopup
            .instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });

        // this.extraFieldsAppService
        //     .addExtraColumnsToGridIfNeeded(TableNames.location, this.locationDataGrid);
    }

    getAddress(data) {
        const address = data.Address;
        const secondaryAddress = data.SecondaryAddress;

        return secondaryAddress
            ? `${address}; ${secondaryAddress}`
            : address;
    }

    openCreateLocationForm() {
        this.isCreateUpdatePopupOpened = true;
        this.isLocationSet = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateLocationForm();
    }

    createUpdateLocation() {
        const validationResult = this.locationCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.loadPanelService.showLoader();

        if (this.isNewLocation) {
            this.location.CompanyId =
                this.companyIdService.companyId;
        }

        const createUpdateLocationPromise = this.isNewLocation
            ? this.locationDataService.create(this.location)
            : this.locationDataService.update(this.location);

        createUpdateLocationPromise
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.locationDataGrid.instance.refresh();

                this.resetCreateUpdateLocationForm();
                this.isCreateUpdatePopupOpened = false;

                this.loadPanelService.hideLoader();

                this.toastService
                    .showSuccessMessage("Location was updated successfuly");
            })
            .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
    }

    onLocationSelected($event) {
        const selectedLocation = $event.selectedRowsData[0];
        if (!selectedLocation) {
            return;
        }

        const selectedLocationId = $event.selectedRowsData[0].Id;

        this.locationDataService.getById(selectedLocationId)
            .then((location) => {
                this.location = location;
                this.isLocationSet = true;
                this.isNewLocation = false;
                this.isCreateUpdatePopupOpened = true;
            })
            .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
    }

    // onExtraFieldsTabCreated($event) {
    //     if ($event) {
    //         this.locationCreationForm.items[0]["tabs"].push($event);
    //         this.locationCreationForm.instance.repaint();
    //     }
    // }

    onLocationFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewLocation && dataField === "IsActive" && !$event.value) {
            this.loadPanelService.showLoader();

            const locationId = this.location.Id;
            this.canDeactivateDeleteLocation(locationId, false)
                .then(canDeactivate => {
                    this.loadPanelService.hideLoader();

                    if (!canDeactivate) {
                        this.location.IsActive = true;
                        alert("Location already is used. You cannot deactivate it.", "WARNING");
                    }
                });
        }
    }

    deleteLocation(location: any, $event: any) {
        $event.stopPropagation();

        this.loadPanelService
            .showLoader();

        const locationId = location.Id;

        this.canDeactivateDeleteLocation(locationId, true)
            .then(canDelete => {
                this.loadPanelService
                    .hideLoader();

                if (!canDelete) {
                    alert("Category already is used. You cannot delete it.", "WARNING");
                    return;
                }

                this.continueDeletingLocation(locationId);
            });
    }

    private continueDeletingLocation(locationId: string): void {
        const confirmationPopup = confirm("Are you sure you want to delete the location ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.loadPanelService
                    .showLoader();

                const filter = `WHERE Id = '${locationId}'`;

                this.locationDataService.getById(locationId)
                    .then((location) => {
                        this.locationDataService.delete(filter, location)
                            .then(() => {
                                this.locationDataGrid
                                    .instance.refresh();

                                this.loadPanelService
                                    .hideLoader();
                            });
                    });
            }
        });
    }

    private canDeactivateDeleteLocation(locationId: string, isDeleteAction: boolean): Promise<boolean> {
        const roomsPromise = this.getRoomsByLocationIdPromise(locationId);
        const appointmentPromise = this.getAppointmentByLocationIdPromise(locationId);

        return Promise.all([roomsPromise, appointmentPromise])
            .then(result => {
                const rooms = result[0];
                const appointment = result[1];

                const areActiveLocationRoomsExist = isDeleteAction
                    ? !!rooms.length
                    : !!rooms.filter(r => r.IsActive).length;

                return !areActiveLocationRoomsExist && !appointment;
            });
    }

    private getAppointmentByLocationIdPromise(locationId: string): Promise<Appointment> {
        const loadOptions = this.getLocationLoadOptions(locationId);

        return this.appointmentDataService
            .firstOrDefault(loadOptions);
    }

    private getRoomsByLocationIdPromise(locationId: string): Promise<Room[]> {
        const loadOptions = this.getLocationLoadOptions(locationId);
        return this.roomDataService
            .search(loadOptions);
    }

    private getLocationLoadOptions(locationId: string): any {
        return {
            filter: this.getLocationFilter(locationId)
        };
    }

    private getLocationFilter(locationId: string): any[] {
        return ["LocationId", "=", locationId];
    }

    private resetCreateUpdateLocationForm() {
        this.isLocationSet = false;
        this.isNewLocation = true;
        this.location = new Location();
        this.selectedLocations = [];
    }

    private init(): any {
        this.initLocationDataSource();
    }

    private initLocationDataSource(): any {
        this.locationDataSource.store =
            new CustomStore({
                byKey: (key) => {
                    return this.locationDataService
                        .getById(key);
                },
                load: (loadOptions: any) => {
                    return this.locationDataService
                        .searchWithCount(loadOptions, "Id")
                        .then(searchResult => {
                            searchResult.data.forEach(location => {
                                this.adjustLocationBeforeRenderInGrid(location);
                            });
                            return searchResult;
                        })
                        .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
                }
            });
        // this.locationDataSource.store =
        //     this.extraFieldsAppService
        //         .getExtraFieldDataSource(this.locationDataService, TableNames.location, "Id", this.adjustLocationBeforeRenderInGrid, this);
    }

    private adjustLocationBeforeRenderInGrid(location: Location) {
        location.State = this.lookups
            .state.filter(s => s.Value == location.State)[0].Name;
    }
}