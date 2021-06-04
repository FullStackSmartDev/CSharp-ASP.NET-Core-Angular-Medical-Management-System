import { SqlTableView } from "../../sqlDataSource/sqlTableView";

export abstract class ReadDataService {
    private _sqlTableView: SqlTableView;

    constructor(sqlTableView: SqlTableView) {
        this._sqlTableView = sqlTableView;
    }

    searchWithCount(loadOptions: any, fieldToCount: string,
        requestedFields: Array<string> = null): Promise<any> {
        return this._sqlTableView
            .searchWithCount(loadOptions, fieldToCount, requestedFields);
    }

    firstOrDefault(loadOptions: any,
        requestedFields: string[] = null): Promise<any> {
        return this._sqlTableView
            .firstOrDefault(loadOptions, requestedFields);
    }

    search(loadOptions: any, requestedFields: string[] = null): Promise<any[]> {
        return this._sqlTableView
            .search(loadOptions, requestedFields);
    }

    count(loadOptions: any, fieldToCount: string): Promise<number> {
        return this._sqlTableView
            .count(loadOptions, fieldToCount);
    }
}