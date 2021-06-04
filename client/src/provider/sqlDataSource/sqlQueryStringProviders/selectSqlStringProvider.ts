import { Injectable } from "@angular/core";
import { SqlFilterConverter } from "../sqlFilterConverter";
import { SqlSortConverter } from "../sqlSortConverter";
import { SqlSource } from "../sqlSource";

@Injectable()
export class SelectSqlStringProvider {
    constructor(private sqlFilterConverter: SqlFilterConverter,
        private sqlSortConverter: SqlSortConverter) {
    }

    getSelectQuery(sqlSource: SqlSource, loadOptions: any,
        requestedColumns: Array<string> = null): string {

        const requestedColumnsString =
            this.getRequstedColumns(sqlSource, requestedColumns);

        let selectQuery = `SELECT ${requestedColumnsString} FROM ${sqlSource.sqlSourceString}`;

        if (loadOptions.filter) {
            const filterSqlString =
                this.sqlFilterConverter
                    .convertToSqlFilters(loadOptions.filter, sqlSource);
            selectQuery = `${selectQuery} WHERE ${filterSqlString}`;
        }

        if (loadOptions.sort) {
            const sortSqlString =
                this.sqlSortConverter.convertToSqlSort(loadOptions.sort[0], sqlSource);
            selectQuery = `${selectQuery} ${sortSqlString}`;
        }

        if (loadOptions.take) {
            const limitSqlString = `LIMIT ${loadOptions.skip}, ${loadOptions.take}`
            selectQuery = `${selectQuery} ${limitSqlString}`;
        }

        return selectQuery;

    }

    getCountQuery(sqlSource: SqlSource, loadOptions: any,
        columnToCount: string = "Id"): string {
        const sqlCountColumn =
            sqlSource.getSourceColumnByName(columnToCount);

        const requestedSqlColumnString =
            `COUNT(${sqlCountColumn.sqlColumn.sqlColumnName}) AS ItemsCount`;

        let selectQuery = `SELECT ${requestedSqlColumnString} FROM ${sqlSource.sqlSourceString}`;

        if (loadOptions.filter) {
            const filterSqlString =
                this.sqlFilterConverter.convertToSqlFilters(loadOptions.filter, sqlSource);
            selectQuery = `${selectQuery} WHERE ${filterSqlString}`;
        }

        return selectQuery;
    }

    private getRequstedColumns(sqlSource: SqlSource, columns: Array<string> = null) {
        const requestedColumns = columns ?
            columns
            : sqlSource.columnNames;
            
        let requestedColumnsString = "";
        requestedColumns.forEach((columnName, index) => {
            const requestedColumn = sqlSource
                .getSourceColumnByName(columnName);

            requestedColumnsString += requestedColumn.useAlias ?
                `${requestedColumn.sqlColumn.sqlColumnName} AS ${requestedColumn.sqlColumn.sqlColumnNameAlias}`
                : requestedColumn.sqlColumn.originalColumnName;

            if (index !== requestedColumns.length - 1) {
                requestedColumnsString += ", ";
            }
        });

        return requestedColumnsString;
    }
}