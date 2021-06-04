import { SqlColumn } from "./sqlColumn";

export class SqlColumnResult {
    private _sqlColumn: SqlColumn;
    private _useAlias: boolean;

    constructor(sqlColumn: SqlColumn, useAlias: boolean) {
        this._sqlColumn = sqlColumn;
        this._useAlias = useAlias;
    }

    get sqlColumn(): SqlColumn {
        return this._sqlColumn;
    }

    get useAlias(): boolean {
        return this._useAlias;
    }
}