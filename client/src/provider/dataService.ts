import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StringHelper } from '../helpers/stringHelper';
import { DateConverter } from '../helpers/dateConverter';
import { BaseDataService } from './baseDataService';
import { SqlQueryBuilder } from './sqlQueryBuilder';
import { TypeHelper } from '../helpers/typeHelper';
import { TableNames } from '../constants/tableNames';
import { ObjectHelpers } from '../helpers/objectHelpers';
import { SearchFilter } from '../classes/searchFilter';
import { ChiefComplaintsResult } from '../classes/chiefComplaintsResult';
import { SyncService } from './syncService';

//todo refactoring of reusable code
@Injectable()
export class DataService extends BaseDataService {
    _db: any;
    _manyToManyUpdateSqlQueries: any = {};

    constructor(private sqlQueryBuilder: SqlQueryBuilder,
        platform: Platform, private syncService: SyncService) {
        super();
        
        const self = this;
        if (platform.is('mobileweb') || platform.is('core')) {
            this._db = (<any>window).openDatabase(this.dbName, "", this.dbDescription, this.dbSize);
        } else {
            this._db = (<any>window).sqlitePlugin.openDatabase({
                name: self.dbName,
                location: 'default',
                androidDatabaseImplementation: 2
            });
        }
    }

    getTemplatesGroupedByType(): any {
        const query = this.sqlQueryBuilder
            .getTemplatesGroupedByTypeQuery();
        return this.executeSearchQuery(query);
    }

    getEntitiesCount(tableName: string) {
        const query = this.sqlQueryBuilder
            .getEntitiesCountQuery(tableName, "Id");
        return this.executeFirstOrDefaultQuery(query);
    }

    getPatientInsuranceByDemographicsId(demographicsId: any): any {
        const query = this.sqlQueryBuilder.getPatientInsuranceByDemographicsIdQuery(demographicsId);
        return this.executeFirstOrDefaultQuery(query);
    }

    getLookupItemsByName(name: string): Promise<Array<string>> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getLookupItemsByNameQuery(name);
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result.rows && result.rows.length > 0) {
                        resultSet = JSON.parse(result.rows[0].JsonValues).Values;
                    }
                    resolve(resultSet);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getAppointmentInfoById(appointmentId: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getAppointmentInfoSqlQuery(appointmentId);
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let appointmentInfo = result.rows[0];
                    if (!appointmentInfo)
                        throw StringHelper.format("Appointment info with Id: {0} was not found", appointmentId);
                    resolve(appointmentInfo);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    getAppointments(): Promise<Array<any>> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getAppointmentGridViewSqlQuery();
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result["rows"] && result["rows"].length > 0) {

                        for (let i = 0; i < result["rows"].length; i++) {
                            let item = result["rows"].item(i);
                            resultSet.push(item)
                        }
                    }
                    resolve(resultSet);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getUser(login: string, encryptedPassword: string): Promise<any> {
        const selectUserSqlQuery = this.sqlQueryBuilder.getUserSelectQuery(login, encryptedPassword);
        return this.executeFirstOrDefaultQuery(selectUserSqlQuery);
    }

    getById(tableName: string, id: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getByIdSqlQuery(tableName, id);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    if (result.rows.length === 0)
                        throw StringHelper.format("Entity of table: {0} and Id: {1} was not found", tableName, id);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getAppointmentCount(startDate: any, endDate: any): any {
        const self = this;
        const startUtcDate = DateConverter.jsLocalDateToSqlServerUtc(startDate);
        const endUtcDate = DateConverter.jsLocalDateToSqlServerUtc(endDate);
        let selectQuery = this.sqlQueryBuilder.getAppointmentCountQuery(startUtcDate, endUtcDate);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getAll(tableName: string, convertSqlDateToJsDate: boolean): Promise<Array<any>> {
        const self = this;
        let selectScript = this.sqlQueryBuilder.getAllSqlQuery(tableName);
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectScript, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result["rows"] && result["rows"].length > 0) {

                        for (let i = 0; i < result["rows"].length; i++) {
                            let item = result["rows"].item(i);
                            for (let columnName in item) {
                                if (!item.hasOwnProperty(columnName))
                                    continue;
                                if (convertSqlDateToJsDate) {
                                    if (TypeHelper.isDate(columnName))
                                        item[columnName] = DateConverter.sqlServerUtcDateToLocalJsDate(item[columnName]);
                                }
                            }
                            resultSet.push(item)
                        }
                    }
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    updateFromPullManyToManyTable(tableName: string, pullResult: any,
        comparisonPredicate: Function): Promise<Array<any>> {
        if (!pullResult || !pullResult.insertedItems || !pullResult.insertedItems.length) {
            return Promise.resolve([]);
        }
        const self = this;
        const pulledItems = pullResult.insertedItems;
        return this.getAll(tableName, false)
            .then(locallySavedItems => {
                if (!locallySavedItems || !locallySavedItems.length) {
                    const bulkInsertPromise = self.bulkInsert(tableName, pulledItems);
                    //need to have the same return type
                    return Promise.all([bulkInsertPromise]);
                }
                const itemsToUpdate = [];
                const itemsToCreate = [];

                pulledItems.forEach(pulledItem => {
                    const locallySavedItem = locallySavedItems
                        .filter(l => comparisonPredicate(l, pulledItem))[0];
                    if (!locallySavedItem) {
                        itemsToCreate.push(pulledItem);
                    }
                    else if (locallySavedItem.IsDelete !== pulledItem.IsDelete) {
                        itemsToUpdate.push(pulledItem);
                    }
                });

                const createUpdatePromises = [];

                if (itemsToCreate.length) {
                    createUpdatePromises.push(self.bulkInsert(tableName, itemsToCreate));
                }

                if (itemsToUpdate.length) {
                    itemsToUpdate.forEach(itemToUpdate => {
                        const updateQuery = self.sqlQueryBuilder
                            .getManyToManyUpdateSqlQuery(tableName, itemToUpdate);
                        const updatePromise = self.executeNonSearchQuery(updateQuery);
                        createUpdatePromises.push(updatePromise);
                    });
                }

                return Promise.all(createUpdatePromises);
            });
    }

    deleAll(tableName: string): any {
        const query = this.sqlQueryBuilder.deleteAllSqlQuery(tableName);
        return this.executeNonSearchQuery(query);
    }

    updateFromPull(tableName: string, pullResult): Promise<any> {
        if (!pullResult || !pullResult.insertedItems || !pullResult.insertedItems.length) {
            return Promise.resolve(true);
        }
        const self = this;
        const items = pullResult.insertedItems;
        this.getAll(tableName, false)
            .then(itemsFromLocalDb => {
                let itemIdsToDelete = [];

                const areItemsStoredLocally = itemsFromLocalDb && itemsFromLocalDb.length;
                if (areItemsStoredLocally) {
                    itemIdsToDelete = items.map(item => {
                        const isItemStoredLocally = !!itemsFromLocalDb
                            .filter(itemFromLocalDb => itemFromLocalDb.Id === item.Id)[0];
                        if (isItemStoredLocally) {
                            return item.Id;
                        }
                    });
                }

                return itemIdsToDelete.length
                    ? self.deleteItemsBySpecificIds(tableName, itemIdsToDelete)
                    : Promise.resolve(true);
            })
            .then(() => {
                return self.bulkInsert(tableName, items);
            });
    }

    deleteItemsBySpecificIds(tableName: string, itemIdsToDelete: any[]): any {
        const query = this.sqlQueryBuilder
            .deleteItemsBySpecificIdsQuery(tableName, itemIdsToDelete);
        return this.executeNonSearchQuery(query);
    }

    bulkInsert(tableName: string, items: Array<any>): Promise<boolean> {
        const self = this;

        const firstItem = items[0];
        const columnNames = self.getColumnNames(firstItem);

        let insertScript = "INSERT INTO " + tableName + self.getInsertValuesStatement(columnNames) + " VALUES ";
        for (let i = 0; i < items.length; i++) {
            let insertedItem = items[i];
            let insertValuesStatement = self.getSqlInsertItemScript(columnNames, insertedItem, false);
            insertScript += insertValuesStatement;
            if (i === items.length - 1) {
                insertScript += ";"
            }
            else {
                insertScript += ", "
            }
        }
        let resultPromise = new Promise<any>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(insertScript, [], function (tx, result) {
                    resolve(result);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    createWithoutId(tableName: string, item: any) {
        const self = this;
        const columnNames = this.getColumnNames(item);
        let insertScript = "INSERT INTO " + tableName + this.getInsertValuesStatement(columnNames) + " VALUES ";
        let insertValuesStatement = self.getSqlInsertItemScript(columnNames, item, true);
        insertScript += insertValuesStatement;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(insertScript, [], function (tx, result) {
                    resolve();
                }, function (tx, error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    create(tableName: string, item: any, companyRelatedEntity: boolean,
        doNotsetId: boolean = false): Promise<any> {
        if (!item || !tableName)
            return;

        const self = this;
        const guid = this.generateGuid();

        if (!doNotsetId && !item.Id)
            item.Id = guid;

        if (companyRelatedEntity)
            item.CompanyId = this.companyId;

        const columnNames = this.getColumnNames(item);

        let insertScript = StringHelper.format("INSERT INTO {0} {1} VALUES {2}",
            tableName, this.getInsertValuesStatement(columnNames), self.getSqlInsertItemScript(columnNames, item, true));

        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(insertScript, [], function (tx, result) {
                    const isInternetConnectionAvailable = navigator.onLine;
                    if (isInternetConnectionAvailable) {
                        if (doNotsetId) {
                            self.syncService.pushSingleItem(tableName, item)
                                .then(() => resolve(item))
                                .catch(error => reject(error));
                        }
                        else {
                            self.getById(tableName, guid)
                                .then(item => {
                                    return self.syncService.pushSingleItem(tableName, item);
                                })
                                .then(() => resolve(guid))
                                .catch(error => reject(error));
                        }
                    }
                }, function (tx, error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    update(tableName: string, id: string, item: any): Promise<any> {
        if (!item || !tableName)
            return;
        const self = this;

        const columnNames = this.getColumnNames(item);
        let updateScript = "UPDATE " + tableName + " SET";

        for (let i = 0; i < columnNames.length; i++) {
            var columnName = columnNames[i];

            var columnValue = item[columnName];
            var isNumber = TypeHelper.isNumber(columnValue);
            var isBoolean = TypeHelper.isBoolean(columnValue);

            if (isBoolean) {
                columnValue = columnValue ? 1 : 0;
            }

            if (TypeHelper.isDate(columnValue)) {
                columnValue = DateConverter.jsLocalDateToSqlServerUtc(columnValue);
            }

            if (TypeHelper.isString(columnValue))
                columnValue = columnValue.replace(/'/g, "''");

            var formattedColumnValue = isNumber || columnValue === null ? columnValue : "'" + columnValue + "'";

            updateScript += " " + columnName + " = " + formattedColumnValue;
            if (i !== columnNames.length - 1) {
                updateScript += ","
            }
        }

        updateScript += " WHERE Id = " + "'" + id + "' ;"

        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(updateScript, [], function (tx, result) {
                    const isInternetConnectionAvailable = navigator.onLine;
                    if (isInternetConnectionAvailable) {
                        self.getById(tableName, id)
                            .then((item) => {
                                return self.syncService.pushSingleItem(tableName, item);
                            })
                            .then(id => resolve(id))
                            .catch(error => reject(error));
                    }
                    else {
                        resolve(id);
                    }
                }, function (tx, error) {
                    reject(error);
                });
            });
        });

        return resultPromise;

    }

    createTables(): Promise<any> {
        let tablesCreationPromises = [];
        for (let i = 0; i < this.createTableScripts.length; i++) {
            const table = this.createTableScripts[i];
            tablesCreationPromises.push(this.createTable(table));
        }

        return Promise.all(tablesCreationPromises);
    }

    createTable(createTableModel: any): Promise<any> {
        let self = this;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(createTableModel.createScript, [], function (tx, result) {
                    console.log(StringHelper.format("Table {0} successfully created.", createTableModel.name));
                    resolve();
                }, function (tx, error) {
                    console.log(StringHelper.format("Error during table {0} creation.Error: {1}", createTableModel.name, error.message));
                    reject(error.message);
                });
            });
        });

        return resultPromise;

    }

    searchCptCodes(searchString: string, limit: number) {
        const self = this;
        const selectQuery = this.sqlQueryBuilder.getCptCodeSearchQuery(searchString, limit);
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result["rows"] && result["rows"].length > 0) {

                        for (let i = 0; i < result["rows"].length; i++) {
                            let item = result["rows"].item(i);
                            resultSet.push(item)
                        }
                    }
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    getPatientAdmissionModelByCompanyId(companyId: string = null): Promise<any> {
        //we use default patient admission model right now where company id is null need to load according company
        let self = this;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(self.sqlQueryBuilder.getPatientAdmissionModelByCompanyIdQuery(companyId), [], function (tx, result) {
                    resolve(result.rows[0])
                }, function (tx, error) {
                    reject(error.message);
                });
            });
        });

        return resultPromise;
    }

    getLastPatientAdmissionModel(patientDemographicId: string): Promise<any> {
        let self = this;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(self.sqlQueryBuilder.getLastPatientAdmissionModelQuery(patientDemographicId), [], function (tx, result) {
                    resolve(result.rows[0])
                }, function (tx, error) {
                    reject(error.message);
                });
            });
        });

        return resultPromise;
    }

    searchChiefComplaints(searchString: string) {
        const query = this.sqlQueryBuilder
            .getChiefComplaintSearchQuery(searchString);
        return this.executeSearchQuery(query);
    }

    searchTemplateLoookupCategories(searchString: string): any {
        const query = this.sqlQueryBuilder.getTemplateLookupCategorySearchQuery(searchString);
        return this.executeSearchQuery(query);
    }

    checkByName(tableName: any, name: string): Promise<boolean> {
        const self = this;
        const selectQuery = this.sqlQueryBuilder.checkByNameSearchQuery(tableName, name);
        let resultPromise = new Promise<boolean>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    resolve(result && result["rows"] && result["rows"].length > 0);
                }, function (error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    searchTemplateLoookupItems(name: string, categoryId: string): Promise<any> {
        const query = this.sqlQueryBuilder.getTempateLookupItemSearchQuery(name, categoryId);
        return this.executeSearchQuery(query);
    }

    getTemplateLookupItemValuesByNameCategoryName(name: string, categoryName: string):
        Promise<Array<any>> {
        const query = this.sqlQueryBuilder
            .getTemplateLookupItemValuesByNameCategoryName(name, categoryName);
        return this.executeFirstOrDefaultQuery(query)
            .then(jsonValues => {
                const values = JSON.parse(jsonValues.JsonValues).Values;
                return values;
            }) as Promise<Array<any>>;
    }

    getTemplateLookupItemWithCategoryName(templateLookupItemId: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder
            .getTempateLookupItemWithCategoryName(templateLookupItemId);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    if (result.rows.length === 0)
                        throw StringHelper.format("Entity of table: {0} and Id: {1} was not found", TableNames.templateLookupItem, templateLookupItemId);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getTemplates(name: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getTempateSearchQuery(name);
        let resultPromise = new Promise<Array<any>>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result["rows"] && result["rows"].length > 0) {

                        for (let i = 0; i < result["rows"].length; i++) {
                            let item = result["rows"].item(i);
                            resultSet.push(item)
                        }
                    }
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    searchTemplateTypes(name: string): any {
        let query = this.sqlQueryBuilder.getTemplateTypeSearchQuery(name);
        return this.executeSearchQuery(query);
    }

    getByName(tableName: string, name: string): Promise<any> {
        let query = this.sqlQueryBuilder
            .getByNameSearchQuery(tableName, name);

        return this.executeFirstOrDefaultQuery(query);
    }

    getChiefComplaintTemplates(chiefComplaintId: string): any {
        let query = this.sqlQueryBuilder
            .getChiefComplaintTemplatesSearchQuery(chiefComplaintId);
        return this.executeSearchQuery(query);
    }

    getAllegationsRelatedChiefComplaints(allegations: string[],
        alreadyAddedChiefComplaintIds: string[]): Promise<Array<any>> {
        let query = this.sqlQueryBuilder
            .getAllegationsRelatedChiefComplaintsQuery(allegations, alreadyAddedChiefComplaintIds);
        return this.executeSearchQuery(query) as Promise<Array<any>>;
    }

    getTemplatesByType(searchStr: string,
        templateTypeName: string, excludedTemplateIds: Array<string>): any {
        const query = this.sqlQueryBuilder
            .getTemplatesByTypeSearchQuery(searchStr, templateTypeName, excludedTemplateIds);
        return this.executeSearchQuery(query);
    }

    getChiefComplaintTemplateById(templateId: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getChiefComplaintTemplateById(templateId);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    if (result.rows.length === 0)
                        resolve([]);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    deleteChiefComplaintTemplatesById(chiefComplaintId: string): Promise<boolean> {
        let query = this.sqlQueryBuilder.deleteChiefComplaintTemplatesQuery(chiefComplaintId);
        return this.executeNonSearchQuery(query);
    }

    deleteChiefComplaintKeywordsById(chiefComplaintId: string): Promise<boolean> {
        let query = this.sqlQueryBuilder.deleteChiefComplaintKeywordsQuery(chiefComplaintId);
        return this.executeNonSearchQuery(query);
    }

    deleteUserPermissionGroup(appUserId: any): Promise<boolean> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.deleteUserPermissionGroupQuery(appUserId);
        let resultPromise = new Promise<boolean>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    resolve(true);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    updateChiefComplaintTemplates(chiefComplaintId: string, templateIds: Array<string>): Promise<any> {
        const self = this;
        return this.getChiefComplaintsTemplates([chiefComplaintId])
            .then(oldTemplates => {
                const templatesToUpdate = [];
                const templatesToCreate = [];

                oldTemplates.forEach(oldTemplate => {
                    const template = templateIds.filter(id => id === oldTemplate.Id)[0];
                    if (!template) {
                        templatesToUpdate.push({
                            ChiefComplaintId: chiefComplaintId,
                            TemplateId: oldTemplate.Id,
                            IsDelete: true
                        });
                    }
                });

                templateIds.forEach(templateId => {
                    const template = oldTemplates.filter(t => t.Id === templateId)[0];
                    if (!template) {
                        templatesToCreate.push({
                            ChiefComplaintId: chiefComplaintId,
                            TemplateId: templateId
                        });
                    }
                });

                const createUpdatePromises = [];

                if (templatesToCreate.length) {
                    const createTemplatesPromise =
                        this.bulkInsert(TableNames.chiefComplaintTemplate, templatesToCreate);
                    createUpdatePromises.push(createTemplatesPromise);
                }

                if (templatesToUpdate.length) {
                    for (let i = 0; i < templatesToUpdate.length; i++) {
                        const templateToUpdate = templatesToUpdate[i];
                        const updateTemplateQuery =
                            self.sqlQueryBuilder.getManyToManyUpdateSqlQuery(TableNames.chiefComplaintTemplate, templateToUpdate);
                        const updateTempltePromise = self.executeNonSearchQuery(updateTemplateQuery);
                        createUpdatePromises.push(updateTempltePromise);
                    }
                }
                return Promise.all(createUpdatePromises);
            })
            .then(() => {
                self.getAll(TableNames.chiefComplaintTemplate, false)
                    .then(chiefcomplaintTemplates => {
                        return self.syncService.push(TableNames.chiefComplaintTemplate, chiefcomplaintTemplates);
                    })
            });
    }

    updateChiefComplaintKeywords(chiefComplaintId: string, keywords: Array<string>) {
        const self = this;
        return this.getChiefComplaintsKeywords([chiefComplaintId])
            .then(oldKeywords => {
                const keywordsToUpdate = [];
                const keywordsToCreate = [];

                oldKeywords.forEach(oldKeyword => {
                    const keyword = keywords.filter(k => k === oldKeyword.Value)[0];
                    if (!keyword) {
                        keywordsToUpdate.push({
                            ChiefComplaintId: chiefComplaintId,
                            KeywordId: oldKeyword.Id,
                            IsDelete: true
                        });
                    }
                });

                keywords.forEach(keywordValue => {
                    const keyword = oldKeywords.filter(k => k.Value === keywordValue)[0];
                    if (!keyword) {
                        const newKeyword = {
                            Value: keywordValue
                        };

                        keywordsToCreate.push(newKeyword);
                    }
                });

                const createUpdatePromises = [];

                if (keywordsToCreate.length) {
                    for (let i = 0; i < keywordsToCreate.length; i++) {
                        const newKeyword = keywordsToCreate[i];
                        const keywordCreationPromise = self
                            .create(TableNames.chiefComplaintKeyword, newKeyword, false)
                            .then(keywordId => {
                                return self.create(TableNames.chiefComplaintRelatedKeyword,
                                    {
                                        ChiefComplaintId: chiefComplaintId,
                                        KeywordId: keywordId
                                    }, false, true);
                            });

                        createUpdatePromises.push(keywordCreationPromise);
                    }
                }

                if (keywordsToUpdate.length) {
                    for (let i = 0; i < keywordsToUpdate.length; i++) {
                        const keywordToUpdate = keywordsToUpdate[i];
                        const updateKeywordQuery =
                            self.sqlQueryBuilder.getManyToManyUpdateSqlQuery(TableNames.chiefComplaintRelatedKeyword, keywordToUpdate);
                        const updateKeywordPromise = self.executeNonSearchQuery(updateKeywordQuery);
                        createUpdatePromises.push(updateKeywordPromise);
                    }
                }
                return Promise.all(createUpdatePromises);
            })
            .then(() => {
                self.getAll(TableNames.chiefComplaintRelatedKeyword, false)
                    .then(chiefComplaintKeywords => {
                        return self.syncService.push(TableNames.chiefComplaintRelatedKeyword, chiefComplaintKeywords);
                    })
            });
    }

    getChiefComplaintsByIds(ids: Array<string>): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getChiefComplaintByIds(ids);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    let resultSet = [];
                    if (result && result["rows"] && result["rows"].length > 0) {

                        for (let i = 0; i < result["rows"].length; i++) {
                            let item = result["rows"].item(i);
                            resultSet.push(item)
                        }
                    }
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    searchTemplateByType(searchString: string, templateType: string): any {
        let query = this.sqlQueryBuilder.getTemplatesByTypeQuery(searchString, templateType);
        return this.executeSearchQuery(query);
    }

    getRequiredTemplates(): any {
        let query = this.sqlQueryBuilder
            .getRequiredTemplatesQuery();
        return this.executeSearchQuery(query);
    }

    searchTemplatesByTypes(types: Array<string>): any {
        let query = this.sqlQueryBuilder.getTemplatesByTypesQuery(types);
        return this.executeSearchQuery(query);
    }

    getTemplateByNameAndType(templateName: string, templateType: string): any {
        let query = this.sqlQueryBuilder
            .getTemplateByNameAndTypeQuery(templateName, templateType);
        return this.executeFirstOrDefaultQuery(query);
    }

    getPatientMedicalHistoryWithCount(tableName: string, patientId: string, skip: number, take: number, searchStr?: string): Promise<any> {
        const patientMedicalHistory = this.getPatientMedicalHistory(tableName, patientId, skip, take, searchStr);
        const patientMedicalHistoryCount = this.getPatientHistoryCount(tableName, patientId);

        return Promise.all([patientMedicalHistoryCount, patientMedicalHistory])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getPatientMedicalHistory(tableName: string, patientId: string, skip: number, take: number, searchStr?: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getMedicalHistorySearchQuery(tableName, patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientFamilyHistoryWithCount(patientId: string, skip: number, take: number, searchStr?: string): Promise<any> {
        const patientMedicalHistory = this.getPatientFamilyHistory(patientId, skip, take, searchStr);
        const patientMedicalHistoryCount = this.getPatientHistoryCount(TableNames.familyHistory, patientId);

        return Promise.all([patientMedicalHistoryCount, patientMedicalHistory])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getEducationHistoryWithCount(patientId: string, skip: number, take: number, searchStr?: string): any {
        const patientEducationHistory = this.getPatientEducationHistory(patientId, skip, take, searchStr);
        const patientEducationHistoryCount = this.getPatientHistoryCount(TableNames.educationHistory, patientId);

        return Promise.all([patientEducationHistoryCount, patientEducationHistory])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getOccupationalHistoryWithCount(patientId: string, skip: number, take: number, searchStr?: string): any {
        const patientOccupationalHistory = this.getPatientOccupationalHistory(patientId, skip, take, searchStr);
        const patientOccupationalHistoryCount = this.getPatientHistoryCount(TableNames.occupationalHistory, patientId);

        return Promise.all([patientOccupationalHistoryCount, patientOccupationalHistory])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getRoomsWithCount(skip: any, take: any, searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder.getRoomListSearchQuery(skip, take, searchValue, includeDeletedItems, true);

        const roomsPromise = this.executeSearchQuery(query.fullQuery);
        const roomCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(roomsPromise, roomCountPromise);
    }

    getEmployeeWithCount(searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder
            .getEmployeesSearchQuery(searchValue, includeDeletedItems, true);

        const employeesPromise = this.executeSearchQuery(query.fullQuery);
        const employeeCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(employeesPromise, employeeCountPromise);
    }

    getChiefComplaintsWithTemplatesAndKeywords(searchFilter: SearchFilter): Promise<any> {
        const chiefComplaints = this.getChiefComplaints(searchFilter);

        const query = this.sqlQueryBuilder.getChiefComplaintsQuery(searchFilter, true);
        const chiefComplaintCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(chiefComplaints, chiefComplaintCountPromise);
    }

    getChiefComplaints(searchFilter: SearchFilter): any {
        const self = this;
        const query = this.sqlQueryBuilder.getChiefComplaintsQuery(searchFilter, false);
        return this.executeSearchQuery(query.fullQuery)
            .then(chiefComplaints => {
                const chiefComplaintsWithTemplatesAndKeywords =
                    new ChiefComplaintsResult();

                if (!chiefComplaints || !chiefComplaints.length) {
                    return Promise.resolve(chiefComplaintsWithTemplatesAndKeywords);
                }
                chiefComplaintsWithTemplatesAndKeywords.chiefComplaints = chiefComplaints;

                const chiefComplaintIds = chiefComplaints.map(cc => cc.Id);

                const templatesQueryPromise = self.getChiefComplaintsTemplates(chiefComplaintIds);
                const keywordsQueryPromise = self.getChiefComplaintsKeywords(chiefComplaintIds)

                return Promise.all([templatesQueryPromise, keywordsQueryPromise])
                    .then(results => {
                        chiefComplaintsWithTemplatesAndKeywords.templates = results[0];
                        chiefComplaintsWithTemplatesAndKeywords.keywords = results[1];
                        return chiefComplaintsWithTemplatesAndKeywords;
                    });
            });
    }

    getChiefComplaintsTemplates(chiefComplaintIds: Array<string>): Promise<Array<any>> {
        if (!chiefComplaintIds || !chiefComplaintIds.length) {
            return Promise.resolve([]);
        }
        const query = this.sqlQueryBuilder.getChiefComplaintsTemplatesQuery(chiefComplaintIds);
        return this.executeSearchQuery(query);
    }

    getChiefComplaintsKeywords(chiefComplaintIds: Array<string>): Promise<any> {
        if (!chiefComplaintIds || !chiefComplaintIds.length) {
            return Promise.resolve([]);
        }
        const query = this.sqlQueryBuilder.getChiefComplaintsKeywordsQuery(chiefComplaintIds);
        return this.executeSearchQuery(query);
    }

    getTemplateLookupItemCategoryWithCount(skip: any, take: any, searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder.getTemplateItemCategoriesSearchQuery(skip, take, searchValue, includeDeletedItems, true);

        const categoriesPromise = this.executeSearchQuery(query.fullQuery);
        const categoryCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(categoriesPromise, categoryCountPromise);
    }

    getPatientsWithCount(skip: any, take: any, patientsFilter: any): any {
        const patientFilterCopy = this.getAdjustedPatientFilter(patientsFilter);
        const patients = this.getFilteredPatients(skip, take, patientFilterCopy);
        const patientsCount = this.getFilteredPatientsCount(TableNames.patientDemographic);

        return Promise.all([patientsCount, patients])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["ItemsCount"]
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getFilteredPatientsCount(filter: any): any {
        const countQuery = this.sqlQueryBuilder.getFilteredPatientsCountQuery(filter);
        const self = this;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(countQuery, [], function (tx, result) {
                    if (result.rows.length === 0)
                        resolve([]);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getFilteredPatients(skip: any, take: any, adjustedPatientFilter: any): any {
        const query = this.sqlQueryBuilder.getFilteredPatientsQuery(skip, take, adjustedPatientFilter);
        return this.executeSearchQuery(query);
    }

    getLocationsWithCount(skip: any, take: any, searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder
            .getLocationsSearchQuery(skip, take, searchValue, includeDeletedItems, true);

        const locationsPromise = this.executeSearchQuery(query.fullQuery);
        const locationCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(locationsPromise, locationCountPromise);
    }

    // getTemplateTypes(loadOptions: any): Promise<any> {
    //     const query = this.sqlQueryBuilder
    //         .getTemplateTypesSearchQuery(loadOptions);

    //     const templateTypesPromise = this.executeSearchQuery(query.fullQuery);
    //     if (!query.countQuery) {
    //         return templateTypesPromise;
    //     }

    //     const templateTypesCountPromise = this.executeCountQuery(query.countQuery);
    //     return this.getWithCountPromise(templateTypesPromise, templateTypesCountPromise);
    // }

    getLookupItemsWithCount(skip: any, take: any, searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder
            .getLookupItemsSearchQuery(skip, take, searchValue, includeDeletedItems, true);

        const lookupItemsPromise = this.executeSearchQuery(query.fullQuery);
        const lookupItemCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(lookupItemsPromise, lookupItemCountPromise);
    }

    getExtraFieldsWithCount(skip: any, take: any, searchValue: any, includeDeletedItems: boolean): any {
        const query = this.sqlQueryBuilder.getExtraFieldsSearchQuery(skip, take, searchValue, includeDeletedItems, true);

        const extraFieldsPromise = this.executeSearchQuery(query.fullQuery);
        const extraFieldCountPromise = this.executeCountQuery(query.countQuery);

        return this.getWithCountPromise(extraFieldsPromise, extraFieldCountPromise);
    }

    getAllergiesWithCount(patientId: string, skip: number, take: number, searchStr?: string): any {
        const patientAllergies = this.getPatientAllergies(patientId, skip, take, searchStr);
        const patientAllergiesCount = this.getPatientHistoryCount(TableNames.allergy, patientId);

        return Promise.all([patientAllergiesCount, patientAllergies])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getMedicationHistoryWithCount(patientId: string, skip: number, take: number, searchStr?: string): any {
        const patientAllergies = this.getPatientMedicationHistory(patientId, skip, take, searchStr);
        const patientAllergiesCount = this.getPatientHistoryCount(TableNames.medicationHistory, patientId);

        return Promise.all([patientAllergiesCount, patientAllergies])
            .then(results => {
                return {
                    data: results[1],
                    totalCount: results[0]["HistoryCount"]

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getPatientFamilyHistory(patientId: string, skip: number, take: number, searchStr?: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getFamilyHistorySearchQuery(patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientHistoryCount(tableName: string, patientId: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getHistoryTotalCountQuery(tableName, patientId);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    if (result.rows.length === 0)
                        resolve([]);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    executeCountQuery(query: string): any {
        const self = this;
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, result) {
                    if (result.rows.length === 0)
                        resolve([]);
                    resolve(result.rows[0]);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientEducationHistory(patientId: string, skip: number, take: number, searchStr?: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getEducationHistorySearchQuery(patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientOccupationalHistory(patientId: string, skip: number, take: number, searchStr?: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getOccupationalSearchQuery(patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientMedicationHistory(patientId: string, skip: number, take: number, searchStr?: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getMedicationHistorySearchQuery(patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getMedications(searchStr: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getMedicationsSearchQuery(searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getPatientAllergies(patientId: string, skip: number, take: number, searchStr?: string): any {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getPatientAllergiesSearchQuery(patientId, skip, take, searchStr);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    searchMedicationUnits(searchString: string): Promise<any> {
        const self = this;
        let selectQuery = this.sqlQueryBuilder.getMedicationUnitsSearchQuery(searchString);
        let resultPromise = new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(selectQuery, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    getAllExtraFieldsByEntityName(relatedEntityName: string): any {
        const query = this.sqlQueryBuilder.getExtraFieldsByEntityNameSearchQuery(relatedEntityName);
        return this.executeSearchQuery(query);
    }

    searchTemplatesWithCount(loadOptions: any): Promise<any> {
        return Promise.resolve({
            data: [],
            totalCount: 0
        });
    }

    getAppointmentsPatientsByDate(startDate: any, endDate: any, searchValue: string): any {
        const utcStartDate = DateConverter.jsLocalDateToSqlServerUtc(startDate);
        const utcEndDate = DateConverter.jsLocalDateToSqlServerUtc(endDate);
        const query = this.sqlQueryBuilder.getAppointmentsPatientsByDateSearchQuery(utcStartDate, utcEndDate, searchValue);
        return this.executeSearchQuery(query);
    }

    getLocationLookups(searchString: string): Promise<Array<any>> {
        const query = this.sqlQueryBuilder.getLocationLookupSearchQuery(searchString);
        return this.executeSearchQuery(query);
    }

    getPatients(searchString: string): Promise<Array<any>> {
        const query = this.sqlQueryBuilder.getPatientsSearchQuery(searchString);
        return this.executeSearchQuery(query);
    }

    getEmployments(searchString: string, employmentType: number): any {
        const query = this.sqlQueryBuilder.getEmploymentsSearchQuery(searchString, employmentType);
        return this.executeSearchQuery(query);
    }

    getRooms(searchString: string, locationId: string): any {
        const query = this.sqlQueryBuilder.getRoomsSearchQuery(searchString, locationId);
        return this.executeSearchQuery(query);
    }

    getAppointmentsByDate(startDate: any, endDate: any): any {
        const utcStartDate = DateConverter.jsLocalDateToSqlServerUtc(startDate);
        const utcEndDate = DateConverter.jsLocalDateToSqlServerUtc(endDate);
        const query = this.sqlQueryBuilder.getAppointmentsSearchQuery(utcStartDate, utcEndDate, []);
        return this.executeSearchQuery(query);
    }

    searchPermissionGroups(searchString: any): Promise<Array<any>> {
        const query = this.sqlQueryBuilder.getPermissionSearchQuery(searchString);
        return this.executeSearchQuery(query);
    }

    getUserPermissionGroups(userId: string): Promise<Array<any>> {
        const query = this.sqlQueryBuilder.getUserPermissionSearchQuery(userId);
        return this.executeSearchQuery(query);
    }

    delete(tableName: any, id: string): Promise<boolean> {
        const self = this;
        const deleteQuery = this.sqlQueryBuilder.getDeleteQuery(tableName, id);
        let resultPromise = new Promise<boolean>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(deleteQuery, [], function (tx, result) {
                    resolve(true);
                }, function (error) {
                    reject(error);
                });
            });
        });

        return resultPromise;
    }

    executeFirstOrDefaultQuery(query: string): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, result) {
                    const resultSet = self
                        .processSingleSelectQueryResult(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
    }

    executeSearchQuery(query: string): Promise<Array<any>> {
        const self = this;
        return new Promise((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, result) {
                    const resultSet = self.processSelectQueryResults(result);
                    resolve(resultSet);
                }, function (error) {
                    reject(error);
                });
            });
        });
    }

    executeNonSearchQuery(query: string): Promise<boolean> {
        const self = this;
        let resultPromise = new Promise<boolean>((resolve, reject) => {
            self._db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, result) {
                    resolve(true);
                }, function (tx, error) {
                    console.log(query);
                    reject(error);
                });
            });
        });
        return resultPromise;
    }

    private processSelectQueryResults(sqlResult: any): Array<any> {
        let resultSet = [];
        if (sqlResult && sqlResult["rows"] && sqlResult["rows"].length > 0) {

            for (let i = 0; i < sqlResult["rows"].length; i++) {
                let item = sqlResult["rows"].item(i);
                resultSet.push(item)
            }
        }

        return resultSet;
    }

    private getAdjustedPatientFilter(patientsFilter: any): any {
        const filterCopy = ObjectHelpers.clone(patientsFilter);

        const appointmentStartDate = filterCopy.appointmentStartDate;
        const appointmentEndDate = filterCopy.appointmentEndDate;
        const dateOfBirth = filterCopy.dateOfBirth;

        if (appointmentStartDate) {
            filterCopy.appointmentStartDate = DateConverter.jsLocalDateToSqlServerUtc(appointmentStartDate);
        }

        if (appointmentEndDate) {
            filterCopy.appointmentEndDate = DateConverter.jsLocalDateToSqlServerUtc(appointmentEndDate);
        }

        if (dateOfBirth) {
            filterCopy.dateOfBirth = DateConverter.jsLocalDateToSqlServerUtc(dateOfBirth);
        }

        return filterCopy;
    }

    private processSingleSelectQueryResult(sqlResult: any): any {
        return sqlResult.rows.length === 0 ? null : sqlResult.rows[0];
    }

    private getWithCountPromise(searchQuery: Promise<any>, countQuery: Promise<any>): Promise<any> {
        return Promise.all([searchQuery, countQuery])
            .then(results => {
                return {
                    data: results[0],
                    totalCount: results[1]["ItemsCount"]
                }
            });
    }
}