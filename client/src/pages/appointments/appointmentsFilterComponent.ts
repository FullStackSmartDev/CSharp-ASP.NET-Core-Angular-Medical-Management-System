import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { AppointmentGridViewDataService } from "../../provider/dataServices/read/readDataServices";
import { LocationDataService, PatientDemographicDataService, EmployeeDataService } from "../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices";
import CustomStore from 'devextreme/data/custom_store';
import { ApplicationConfigurationService } from "../../provider/applicationConfigurationService";
import { DxLookupComponent } from "devextreme-angular";
import { AppointmentsFilter } from "./appointmentsFilter";

@Component({
    selector: 'appointments-filter',
    templateUrl: 'appointmentsFilterComponent.html'
})
export class AppointmentsFilterComponent {
    @ViewChild("physicianLookup") physicianLookup: DxLookupComponent;
    @ViewChild("locationLookup") locationLookup: DxLookupComponent;
    @ViewChild("patientLookup") patientLookup: DxLookupComponent;

    @Output() onFilterChanged = new EventEmitter<any>();

    private _startDate: any;
    private _endDate: any;

    get startDate(): any {
        return this._startDate;
    }

    get endDate(): any {
        return this._endDate;
    }

    @Input("startDate")
    set startDate(startDate: any) {
        this._startDate = startDate;
        if (this.startDate && this.endDate) {
            this.reloadLookups();
        }
    }

    @Input("endDate")
    set endDate(endDate: any) {
        this._endDate = endDate;
        if (this.startDate && this.endDate) {
            this.reloadLookups();
        }
    }

    physianDataSource: any = {};
    locationDataSource: any = {};
    patientDataSource: any = {};

    applicationConfiguration: any
        = ApplicationConfigurationService;

    filter: AppointmentsFilter =
        new AppointmentsFilter();

    constructor(private appointmentGridViewDataService: AppointmentGridViewDataService,
        private patientsDataService: PatientDemographicDataService,
        private employeeDataService: EmployeeDataService,
        private locationDataService: LocationDataService) {
        this.init();
    }

    init() {
        this.initPhysianDataSource();
        this.initLocationDataSource();
        this.initPatientDataSource();
    }

    filterChanged($event) {
        this.onFilterChanged.next(this.filter);
    }

    private reloadLookups(): any {
        const areLookupsReady = this.patientLookup
            && this.locationLookup && this.physicianLookup;

        if (!areLookupsReady) {
            return;
        }

        const areLookupInstancesReady = this.patientLookup.instance
            && this.locationLookup.instance && this.physicianLookup.instance;

        if (!areLookupInstancesReady) {
            return;
        }

        this.patientLookup.instance
            .getDataSource().reload();

        this.locationLookup.instance
            .getDataSource().reload();

        this.physicianLookup.instance
            .getDataSource().reload();
    }

    private initLocationDataSource(): any {
        const self = this;
        this.locationDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return self.locationDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["LocationId", "LocationName"];

                const takeItemCount = self.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                loadOptions.filter = self.startEndDateFilter;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter.push("and");
                    loadOptions.filter.push([searchExpr, searchOperation, searchValue]);
                }
                return self.appointmentGridViewDataService
                    .search(loadOptions, requestedFields)
                    .then(locations => {
                        return self.getUniqueItems(locations, "LocationId");
                    });
            }
        });
    }

    private initPatientDataSource(): any {
        const self = this;
        this.patientDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return self.patientsDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["PatientId", "PatientFirstName", "PatientLastName"];

                const takeItemCount = self.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = "PatientLastName";
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                loadOptions.filter = self.startEndDateFilter;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter.push("and");
                    loadOptions.filter.push([searchExpr, searchOperation, searchValue]);
                }
                return self.appointmentGridViewDataService
                    .search(loadOptions, requestedFields)
                    .then(patients => {
                        const adjustedPatients = patients.map(p => {
                            return {
                                PatientId: p.PatientId,
                                Name: `${p.PatientFirstName} ${p.PatientLastName}`
                            };
                        });
                        return self.getUniqueItems(adjustedPatients, "PatientId");
                    });
            }
        });
    }

    private initPhysianDataSource(): any {
        const self = this;
        this.physianDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return self.employeeDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["PhysicianId", "PhysicianFirstName", "PhysicianLastName"];

                const takeItemCount = self.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = "PhysicianLastName";
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                loadOptions.filter = self.startEndDateFilter;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter.push("and");
                    loadOptions.filter.push([searchExpr, searchOperation, searchValue]);
                }
                return self.appointmentGridViewDataService
                    .search(loadOptions, requestedFields)
                    .then(patients => {
                        const adjustedPatients = patients.map(p => {
                            return {
                                PhysicianId: p.PhysicianId,
                                Name: `${p.PhysicianFirstName} ${p.PhysicianLastName}`
                            };
                        });
                        return self.getUniqueItems(adjustedPatients, "PhysicianId");
                    });
            }
        });
    }

    private getUniqueItems(items: any[], uniqueFieldName: string): any {
        const uniqueItems = [];
        const uniqueItemIds = {};

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = item[uniqueFieldName];

            if (!uniqueItemIds[id]) {
                uniqueItemIds[id] = id;
                uniqueItems.push(item);
            }
        }

        return uniqueItems;
    }

    private get startEndDateFilter(): Array<any> {
        return [
            ["StartDate", ">=", this.startDate],
            "and",
            ["EndDate", "<=", this.endDate]
        ]
    }
}