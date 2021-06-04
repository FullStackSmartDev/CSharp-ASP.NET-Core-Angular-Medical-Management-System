import { ConvertibleFromEntityModel } from "../../../dataModels/baseEntityModel";
import { ISearchableByName, IEntityCountProvider } from "../../sqlDataSource/iSearchableSource";
import { SqlTable } from "../../sqlDataSource/sqlTable";
import { SyncService } from "../../syncService";

export abstract class ReadCreateUpdateDataService<T extends ConvertibleFromEntityModel> implements ISearchableByName, IEntityCountProvider {
    private _synchronizationApiEndpointName: string;
    private _dataModel: T;

    constructor(private sqlTable: SqlTable<T>, private syncService: SyncService) {

        this._synchronizationApiEndpointName =
            this.sqlTable.dataModel.constructor.name;

        this._dataModel =
            this.sqlTable.dataModel;
    }

    firstOrDefault(loadOptions: any): Promise<T> {
        return this.sqlTable
            .firstOrDefault(loadOptions)
            .then(entityModel => {
                return entityModel
                    ? this._dataModel.createFromEntityModel(entityModel)
                    : null;
            })
    }

    getByNameActiveOnly(name: string): Promise<T> {
        const loadOptions = {
            filter: [["Name", "=", name], "and", ["IsActive", "=", true]]
        }

        return this.sqlTable
            .firstOrDefault(loadOptions);
    }

    getByName(name: string): Promise<T> {
        const loadOptions = {
            filter: [["Name", "=", name]] 
        }

        return this.sqlTable
            .firstOrDefault(loadOptions);
    }

    getById(id: string): Promise<T> {
        const loadOptions = {
            filter: ["Id", "=", id]
        }
        return this.sqlTable
            .firstOrDefault(loadOptions)
            .then(entity => {
                const adjustedTemplateType = this._dataModel
                    .createFromEntityModel(entity);
                return adjustedTemplateType;
            })
    }

    create(dataModel: T): Promise<T> {
        const modelsToInsert = [dataModel];
        return this.sqlTable
            .insert(modelsToInsert)
            .then(insertedEntities => {
                return this.syncService
                    .push(this._synchronizationApiEndpointName, insertedEntities)
                    .then(() => {
                        return insertedEntities[0];
                    })
            })
    }

    delete(filterQuery: string, item: any): Promise<boolean> {
        return this.sqlTable
            .delete(filterQuery)
            .then(() => {
                return this.syncService.delete(this._synchronizationApiEndpointName, item)
                    .then(() => {
                        return true;
                    });
            });
    }

    update(dataModel: T, specificFilter: any[] = null): Promise<T> {
        return this.sqlTable
            .update(dataModel, specificFilter)
            .then((tt) => {
                return this.syncService
                    .push(this._synchronizationApiEndpointName, [tt])
                    .then(() => {
                        return tt;
                    })
            })
    }

    search(loadOptions: any, requestedFields: Array<string> = null): Promise<Array<any>> {
        return this.sqlTable
            .search(loadOptions, requestedFields)
            .then(searchResult => {
                return searchResult.map(tt => this._dataModel
                    .createFromEntityModel(tt));
            })
    }

    searchWithCount(loadOptions: any, fieldToCount: string): Promise<any> {
        return this.sqlTable
            .searchWithCount(loadOptions, fieldToCount)
            .then(searchResult => {
                searchResult.data = searchResult
                    .data.map(tt => this._dataModel
                        .createFromEntityModel(tt));
                return searchResult;
            })
    }

    count(loadOptions: any, fieldToCount: string): Promise<number> {
        return this.sqlTable
            .count(loadOptions, fieldToCount);
    }
}