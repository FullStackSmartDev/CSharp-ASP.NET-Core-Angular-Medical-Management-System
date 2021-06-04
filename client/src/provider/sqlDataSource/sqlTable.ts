import { DataService } from "../dataService";
import { SqlTableView } from "./sqlTableView";
import { InsertSqlStringProvider } from "./sqlQueryStringProviders/insertSqlStringProvider";
import { UpdateSqlStringProvider } from "./sqlQueryStringProviders/updateSqlStringProvider";
import { SqlSource } from "./sqlSource";
import { ConvertibleFromEntityModel } from "../../dataModels/baseEntityModel";
import { SelectSqlStringProvider } from "./sqlQueryStringProviders/selectSqlStringProvider";

export class SqlTable<T extends ConvertibleFromEntityModel> extends SqlTableView {
    private _dataModel: T;

    constructor(private insertSqlStringProvider: InsertSqlStringProvider,
        private updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider,
        dataSerice: DataService, dataModel: T) {

        super(dataSerice, selectSqlStringProvider);
        this._dataModel = dataModel;
    }

    get dataModel(): T {
        return this._dataModel;
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(this.dataModel);
    }

    insert(dataModels: Array<any>): Promise<Array<any>> {
        const insertSqlString =
            this.insertSqlStringProvider
                .getSqlInsertString(dataModels, this.sqlSource);
        return this.dataService
            .executeNonSearchQuery(insertSqlString)
            .then(() => {
                return dataModels;
            })
    }

    update(dataModel: any, specificFilter: any[] = null): Promise<any> {
        const filter = specificFilter
            ? specificFilter
            : ["Id", "=", dataModel.Id];
            
        const insertSqlString =
            this.updateSqlStringProvider
                .getSqlUpdateString(dataModel, this.sqlSource, filter);
        return this.dataService
            .executeNonSearchQuery(insertSqlString)
            .then(() => {
                return dataModel;
            })
    }

    delete(filterQuery: string): Promise<boolean> {
        const deleteSqlString = `DELETE FROM ${this.sqlSource.sqlSourceString} ${filterQuery}`;

        return this.dataService
            .executeNonSearchQuery(deleteSqlString)
            .then(() => {
                return true;
            })
    }
}