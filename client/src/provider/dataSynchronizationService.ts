import { Injectable } from '@angular/core';
import { SyncService } from './syncService';
import { TableNames } from '../constants/tableNames';
import { StringHelper } from '../helpers/stringHelper';
import { DataService } from './dataService';

@Injectable()
export class DataSynchronizationService {
    _tablesToSynchronize: Array<any> = [
        { tableName: TableNames.tobaccoHistory },
        { tableName: TableNames.medicalRecord },
        { tableName: TableNames.addendum },
        { tableName: TableNames.alcoholHistory },
        { tableName: TableNames.drugHistory },
        { tableName: TableNames.company },
        { tableName: TableNames.patientDataModel, isPullOnly: true },
        { tableName: TableNames.location },
        { tableName: TableNames.room },
        { tableName: TableNames.appUser },
        { tableName: TableNames.permissionGroup },
        { tableName: TableNames.employee },
        { tableName: TableNames.patientDemographic },
        { tableName: TableNames.appointment },
        { tableName: TableNames.admission },
        { tableName: TableNames.allergy },
        {
            tableName: TableNames.appUserPermissionGroup,
            isManyToManyTable: true,
            comparisonPredicate: function (item1, item2) {
                return item1.AppUserId === item2.AppUserId &&
                    item1.PermissionGroupId === item2.PermissionGroupId;
            }
        },
        { tableName: TableNames.chiefComplaint },
        { tableName: TableNames.chiefComplaintKeyword },
        {
            tableName: TableNames.chiefComplaintRelatedKeyword,
            isManyToManyTable: true,
            comparisonPredicate: function (item1, item2) {
                return item1.ChiefComplaintId === item2.ChiefComplaintId &&
                    item1.KeywordId === item2.KeywordId;

            }
        },
        { tableName: TableNames.templateType },
        { tableName: TableNames.template },
        {
            tableName: TableNames.chiefComplaintTemplate,
            isManyToManyTable: true,
            comparisonPredicate: function (item1, item2) {
                return item1.ChiefComplaintId === item2.ChiefComplaintId &&
                    item1.TemplateId === item2.TemplateId;

            }
        },
        {
            tableName: TableNames.templateLookupItemTracker,
            isManyToManyTable: true,
            comparisonPredicate: function (item1, item2) {
                return item1.TemplateId === item2.TemplateId &&
                    item1.TemplateLookupItemId === item2.TemplateLookupItemId
                    && item1.NumberOfLookupItemsInTemplate === item2.NumberOfLookupItemsInTemplate;
            }
        },
        { tableName: TableNames.cptCode, isPullOnly: true },
        { tableName: TableNames.educationHistory },
        { tableName: TableNames.extraField },
        {
            tableName: TableNames.entityExtraFieldMap,
            isManyToManyTable: true,
            comparisonPredicate: function (item1, item2) {
                return item1.EntityId === item2.EntityId &&
                    item1.ExtraFieldId === item2.ExtraFieldId;
            }
        },
        { tableName: TableNames.familyHistory },
        { tableName: TableNames.medicalHistory },
        { tableName: TableNames.medicationHistory },
        { tableName: TableNames.occupationalHistory },
        { tableName: TableNames.surgicalHistory },
        { tableName: TableNames.templateLookupItemCategory },
        { tableName: TableNames.templateLookupItem },
        { tableName: TableNames.patientInsurance },
        { tableName: TableNames.vitalSigns },
        { tableName: TableNames.baseVitalSigns },
        { tableName: TableNames.signatureInfo }
    ];

    constructor(private syncService: SyncService,
        private dataService: DataService) {
    }

    synchronizeTable(tableName: string) {
        const isTableCanSynchronize = !!this._tablesToSynchronize
            .filter(t => t.tableName === tableName)[0];
        if (!isTableCanSynchronize) {
            return;
        }
    }

    synchronizeTables(skippedTables: Array<string> = []): Promise<any> {
        const promises = [];

        for (let i = 0; i < this._tablesToSynchronize.length; i++) {
            const tableDescription = this._tablesToSynchronize[i];
            const tableName = tableDescription.tableName;
            if (skippedTables.length && skippedTables.indexOf(tableName) === 1) {
                continue;
            }

            const tableSynchronizePromise = this.createTableSynchronizePromise(tableDescription);
            promises.push(tableSynchronizePromise);
        }

        return Promise.all(promises);
    }

    private createTableSynchronizePromise(tableDescription: any) {
        const self = this;

        const tableName = tableDescription.tableName;
        const isManyToManyTable = tableDescription.isManyToManyTable;
        const comparisonPredicate = tableDescription.comparisonPredicate;
        const isPullOnly = tableDescription.isPullOnly;

        return this.syncService.pull(tableName)
            .then((pullResult) => {
                console.log(StringHelper.format("Pull from {0}", tableName));
                return isManyToManyTable
                    ? self.dataService.updateFromPullManyToManyTable(tableName, pullResult, comparisonPredicate)
                    : self.dataService.updateFromPull(tableName, pullResult);
            })
            .then(() => {
                return self.dataService.getAll(tableName, false);
            })
            .then((items) => {
                if (isPullOnly) {
                    return Promise.resolve(true);
                }
                return self.syncService.push(tableName, items);
            })
    }
}