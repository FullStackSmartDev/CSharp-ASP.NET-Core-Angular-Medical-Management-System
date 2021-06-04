import { SelectSqlStringProvider } from "./sqlQueryStringProviders/selectSqlStringProvider";
import { DataService } from "../dataService";
import { SqlSource } from "./sqlSource";

export abstract class SqlTableView {
    constructor(protected dataService: DataService,
        private selectSqlStringProvider: SelectSqlStringProvider) { }

    abstract get sqlSource(): SqlSource;

    searchWithCount(loadOptions: any, fieldToCount: string, requestedFields: string[] = null): Promise<any> {
        const searchPromise = this.search(loadOptions, requestedFields);
        const countPromise = this.count(loadOptions, fieldToCount);

        return Promise.all([searchPromise, countPromise])
            .then(result => {
                return {
                    data: result[0],
                    totalCount: result[1]
                }
            });
    }

    firstOrDefault(loadOptions: any, requestedFields: string[] = null): Promise<any> {
        const sqlQueryString = this.selectSqlStringProvider
            .getSelectQuery(this.sqlSource, loadOptions, requestedFields);
        return this.dataService
            .executeFirstOrDefaultQuery(sqlQueryString);
    }

    search(loadOptions: any, requestedFields: string[] = null): Promise<any[]> {
        const sqlQueryString = this.selectSqlStringProvider
            .getSelectQuery(this.sqlSource, loadOptions, requestedFields);

        return this.dataService
            .executeSearchQuery(sqlQueryString);
    }

    count(loadOptions: any, fieldToCount: string): Promise<number> {
        const sqlQueryString = this.selectSqlStringProvider
            .getCountQuery(this.sqlSource, loadOptions, fieldToCount);

        return this.dataService
            .executeCountQuery(sqlQueryString)
            .then(countResult => {
                return countResult.ItemsCount;
            });
    }
}