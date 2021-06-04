import { SqlColumn } from "./sqlColumn";

export class TableColumnsMetadata {
    sqlColumns: Array<SqlColumn>;
    sqlColumnNames: Array<string>;

    constructor(sqlColumns: Array<SqlColumn> = [], sqlColumnNames: Array<string> = []) {
        this.sqlColumns = sqlColumns;
        this.sqlColumnNames = sqlColumnNames;
    }
}