import { SqlColumn } from "./sqlColumn";
import { SqlColumnResult } from "./sqlColumnResult";
import { TableColumnsMetadata } from "./tableColumnsMetadata";

export class SqlSource {
    private _columns: Array<SqlColumn>;
    private _sqlSourceString: string;
    private _columnNames: Array<string>;

    private constructor(
        sqlTableDataModel: any,
        columns: Array<SqlColumn> = null,
        columnNames: Array<string> = null,
        sqlSourceString: string = null) {

        if (sqlTableDataModel) {
            const columnsMetadata =
                this.getColumnsMetadata(sqlTableDataModel);
            this._columns = columnsMetadata.sqlColumns;
            this._columnNames = columnsMetadata.sqlColumnNames;
            this._sqlSourceString = this.getTableName(sqlTableDataModel);
        }
        else {
            this._columnNames = columnNames;
            this._columns = columns;
            this._sqlSourceString = sqlSourceString;
        }
    }

    static createFromDataModel(sqlTableDataModel: any): SqlSource {
        return new SqlSource(sqlTableDataModel);
    }

    static createFromMetadata(columns: Array<SqlColumn>,
        columnNames: Array<string>,
        sqlSourceString: string): SqlSource {
        return new SqlSource(null, columns, columnNames, sqlSourceString);
    }

    get columnNames(): Array<string> {
        return this._columnNames;
    }

    getSourceColumnByName(columnName: string): SqlColumnResult {
        if (this._columnNames.indexOf(columnName) === -1) {
            throw `Requested column with name: ${columnName} was not found`;
        }

        let sqlColumn = this._columns
            .filter(c => c.sqlColumnNameAlias === columnName)[0];

        if (sqlColumn) {
            return new SqlColumnResult(sqlColumn, true);
        }

        sqlColumn = this._columns
            .filter(c => c.originalColumnName === columnName)[0];

        if (!sqlColumn) {
            throw `Requested column with name: ${columnName} was not found`;
        }

        return new SqlColumnResult(sqlColumn, false);
    }

    get sqlSourceString(): string {
        return this._sqlSourceString;
    }

    join(sqlTableDataModel: any, key: string,
        referenceKey: string): SqlSource {

        const joinedTablesColumns: Array<SqlColumn> =
            this._columns.slice();
        const joinedTablesColumnNames: Array<string> =
            this._columnNames.slice();

        const joinTableColumnsMetadata =
            this.getColumnsMetadata(sqlTableDataModel);

        const joinTableColumns =
            joinTableColumnsMetadata.sqlColumns;

        for (let i = 0; i < joinTableColumns.length; i++) {
            const joinedColumn = joinTableColumns[i];
            const joinedColumnOriginalName =
                joinedColumn.originalColumnName;

            const alreadyExistedColumnsWithSameOriginalName =
                this._columns.filter(c => c.originalColumnName === joinedColumnOriginalName);

            if (!alreadyExistedColumnsWithSameOriginalName.length) {
                joinedTablesColumnNames
                    .push(joinedColumn.originalColumnName);
            }
            else {
                joinedTablesColumnNames.push(joinedColumn.sqlColumnNameAlias);
                alreadyExistedColumnsWithSameOriginalName
                    .forEach(c => {
                        const columnIndexWithOriginalName
                            = joinedTablesColumnNames.indexOf(c.originalColumnName)
                        if (columnIndexWithOriginalName !== -1) {
                            joinedTablesColumnNames.splice(columnIndexWithOriginalName, 1, c.sqlColumnNameAlias);
                        }
                    })
            }

            joinedTablesColumns.push(joinedColumn);
        }

        const joinTableName = this
            .getTableName(sqlTableDataModel);

        const referenceKeySqlColumnName
            = this._columns.filter(c => c.originalColumnName === referenceKey)[0].sqlColumnName;

        const keySqlColumnName
            = joinTableColumns.filter(c => c.originalColumnName === key)[0].sqlColumnName;

        const sqlSourceString =
            this._sqlSourceString + ` JOIN ${joinTableName} ON ${referenceKeySqlColumnName} = ${keySqlColumnName}`;

        return SqlSource
            .createFromMetadata(joinedTablesColumns, joinedTablesColumnNames, sqlSourceString)
    }

    private getColumnsMetadata(sqlTableDataModel: any): any {
        const tableName =
            this.getTableName(sqlTableDataModel);

        const sqlColumns = [];
        const sqlColumnNames = [];

        for (const columnName in sqlTableDataModel) {
            if (sqlTableDataModel.hasOwnProperty(columnName)) {
                const sqlColumn = new SqlColumn(tableName, columnName);
                sqlColumns.push(sqlColumn);
                sqlColumnNames.push(columnName);
            }
        }
        return new TableColumnsMetadata(sqlColumns, sqlColumnNames);
    }

    private getTableName(sqlTableDataModel: any) {
        return sqlTableDataModel.constructor.name;
    }
}