import { SqlColumnNameAliasProvider } from "./sqlColumnNameAliasProvider";

export class SqlColumn {
    private _sqlColumnNameAliasProvider: SqlColumnNameAliasProvider;

    private _originalColumnName: string;
    private _tableName: string;

    constructor(tableName: string, originalColumnName: string) {
        this._originalColumnName = originalColumnName;
        this._tableName = tableName;
        this._sqlColumnNameAliasProvider = new SqlColumnNameAliasProvider();
    }

    get originalColumnName(): string {
        return this._originalColumnName;
    }

    get sqlColumnName(): string {
        return `${this._tableName}.${this._originalColumnName}`;
    }

    get sqlColumnNameAlias(): string {
        return this._sqlColumnNameAliasProvider
            .getColumnNameAlias(this._tableName, this._originalColumnName);
    }
}