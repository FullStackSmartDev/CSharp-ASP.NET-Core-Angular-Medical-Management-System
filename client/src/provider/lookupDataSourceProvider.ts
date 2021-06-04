import { Injectable } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DataService } from './dataService';
import { TableNames } from '../constants/tableNames';
import notify from 'devextreme/ui/notify';
import { CptCodeReadDataService } from './dataServices/read/readDataServices';
import { ApplicationConfigurationService } from './applicationConfigurationService';
import { LocationDataService, CategoryDataService, TemplateTypeDataService, RoomDataService } from './dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { IcdCodeReadDataService } from './dataServices/read/IcdCodeReadDataService';
import { MedicationReadDataService } from './dataServices/read/medicationReadDataService';


@Injectable()
export class LookupDataSourceProvider {
    protected applicationConfiguration: any;

    constructor(private dataService: DataService,
        private icdCodeReadDataService: IcdCodeReadDataService,
        private locationDataService: LocationDataService,
        private categoryDataService: CategoryDataService,
        private templateTypeDataService: TemplateTypeDataService,
        private cptCodeReadDataService: CptCodeReadDataService,
        private roomDataService: RoomDataService,
        private medicationReadDataService: MedicationReadDataService) {

        this.applicationConfiguration = ApplicationConfigurationService;
    }

    get cptCodeLookupDataSource(): CustomStore {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                const loadOptions = {
                    filter: ["Id", "=", key]
                };

                return this.cptCodeReadDataService
                    .firstOrDefault(loadOptions);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["Id", "Name"];

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount;

                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [searchExpr, searchOperation, searchValue];
                }
                return this.cptCodeReadDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }

    get permissionGroupDataSource(): CustomStore {
        const self = this;
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService.getById(TableNames.permissionGroup, key);
            },
            load: (loadOptions: any) => {
                const searchString = loadOptions.searchValue;
                return self.dataService.searchPermissionGroups(searchString);
            }
        });
    }

    get icdCodeLookupDataSource(): CustomStore {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.icdCodeReadDataService.getById(key);
            },
            load: (loadOptions: any) => {
                const takeItemCount = ApplicationConfigurationService
                    .defaultPageSizeCount

                const searchValue = loadOptions.searchValue;

                return this.icdCodeReadDataService
                    .search(takeItemCount, searchValue);
            }
        });
    }

    getPatientHistoryLookupDataSource(tableName: string, patientId: string): CustomStore {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getPatientMedicalHistoryWithCount(tableName, patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            },
            remove: (medicalHistoryItem: any) => {
                return self.dataService.delete(tableName, medicalHistoryItem.Id);
            }
        });
    }

    getFamilyHistoryLookupDataSource(patientId: string): any {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getPatientFamilyHistoryWithCount(patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            },
            remove: (medicalHistoryItem: any) => {
                return self.dataService.delete(TableNames.familyHistory, medicalHistoryItem.Id);
            }
        });
    }

    getEducationHistoryLookupDataSource(patientId: string): any {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getEducationHistoryWithCount(patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            },
            remove: (familyHistoryItem: any) => {
                return self.dataService.delete(TableNames.educationHistory, familyHistoryItem.Id);
            }
        });
    }

    getOccupationalHistoryLookupDataSource(patientId: string): any {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getOccupationalHistoryWithCount(patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            },
            remove: (occupationalHistoryItem: any) => {
                return self.dataService.delete(TableNames.occupationalHistory, occupationalHistoryItem.Id);
            }
        });
    }

    getMedicationHistoryLookupDataSource(patientId: string): any {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getMedicationHistoryWithCount(patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            }
        });
    }

    getAllergyLookupDataSource(patientId: string): any {
        const self = this;
        return new CustomStore({
            load: function (loadOptions: any) {
                const skip = loadOptions.skip || ApplicationConfigurationService.defaultSkipItemsCount;
                const take = loadOptions.take || ApplicationConfigurationService.defaultTakeItemsCount;
                const searchStr = loadOptions.searchValue;

                return self.dataService.getAllergiesWithCount(patientId, skip, take, searchStr)
                    .then((data: any) => {
                        return data;
                    })
                    .catch(error => notify(error, "error", 1500));
            }
        });
    }

    getEmploymentLookupDataSource(employmentType: number): any {
        const self = this;
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService.getById(TableNames.employee, key);
            },
            load: (loadOptions: any) => {
                const searchString = loadOptions.searchValue;
                return self.dataService.getEmployments(searchString, employmentType);
            }
        });
    }

    getRoomLookupDataSource(locationId: string): any {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.roomDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const locationFilter = ["LocationId", "=", locationId];
                const isDeleteFilter = ["IsActive", "=", true];
                const requestedFields = ["Id", "Name"];

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                const filter = [isDeleteFilter, "and", locationFilter];

                if (searchExpr && searchOperation && searchValue) {
                    filter.push("and");
                    filter.push([searchExpr, searchOperation, searchValue]);
                }

                loadOptions.filter = filter;

                return this.roomDataService.search(loadOptions, requestedFields);
            }
        });
    }

    get lookupItemCategoryDataSource(): any {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.categoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const isActiveFilter = ["IsActive", "=", true];
                const requestedFields = ["Id", "Title"];

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [[searchExpr, searchOperation, searchValue], "and", isActiveFilter];
                }
                else {
                    loadOptions.filter = isActiveFilter;
                }
                return this.categoryDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }

    get medicationLookupDataSource(): any {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.medicationReadDataService.getById(key);
            },
            load: (loadOptions: any) => {
                const takeItemCount = ApplicationConfigurationService
                    .defaultPageSizeCount

                const searchValue = loadOptions.searchValue;

                return this.medicationReadDataService
                    .search(takeItemCount, searchValue);
            }
        });
    }

    get templateTypeLookupDataSource(): any {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.templateTypeDataService.
                    getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["Id", "Title"];
                const isActiveFilter = ["IsActive", "=", true];

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount

                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [
                        [searchExpr, searchOperation, searchValue],
                        "and",
                        isActiveFilter
                    ];
                }
                else {
                    loadOptions.filter = isActiveFilter;
                }

                return this.templateTypeDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }

    get locationLookupDataSource(): any {
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.locationDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const isActiveFilter = ["IsActive", "=", true];
                const requestedFields = ["Id", "Name"];

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [
                        [searchExpr, searchOperation, searchValue],
                        "and",
                        isActiveFilter
                    ];
                }
                else {
                    loadOptions.filter = isActiveFilter;
                }
                return this.locationDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }

    get patientLookupDataSource(): any {
        const self = this;
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService.getById(TableNames.patientDemographic, key);
            },
            load: (loadOptions: any) => {
                const searchString = loadOptions.searchValue;
                return self.dataService.getPatients(searchString);
            }
        });
    }
}