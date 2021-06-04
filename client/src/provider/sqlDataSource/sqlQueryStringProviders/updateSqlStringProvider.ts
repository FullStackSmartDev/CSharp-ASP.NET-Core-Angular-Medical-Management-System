import { Injectable } from "@angular/core";
import { SqlSource } from "../sqlSource";
import { SqlValuesProvider } from "./sqlValuesProvider";
import { SqlFilterConverter } from "../sqlFilterConverter";

@Injectable()
export class UpdateSqlStringProvider {
    constructor(private sqlValueProvider: SqlValuesProvider, private sqlFilterConverter: SqlFilterConverter) { }

    getSqlUpdateString(dataModel: any, sqlSource: SqlSource, filter: any): string {
        let sqlUpdateSqlString = `UPDATE ${sqlSource.sqlSourceString}`;
        const updatedRowValuesString =
            this.getUpdatedRowValues(dataModel, sqlSource, filter);

        return `${sqlUpdateSqlString} ${updatedRowValuesString}`;
    }

    private getUpdatedRowValues(dataModel: any, sqlSource: SqlSource, filter: any): string {
        let insertedRowValuesString = "SET ";
        const insertedColumnNames = sqlSource.columnNames;

        insertedColumnNames.forEach((cn, index) => {
            const columnValue = dataModel[cn];
            const convertedSqlColumnValue =
                this.sqlValueProvider.getSqlValue(columnValue);
            const setColumnValueString = `${cn} = ${convertedSqlColumnValue.sqlFormattedStringValue}`;

            insertedRowValuesString += setColumnValueString;

            if (index !== insertedColumnNames.length - 1) {
                insertedRowValuesString += ", ";
            }
        });

        const whereFilterString =
            this.sqlFilterConverter.convertToSqlFilters(filter, sqlSource);

        return `${insertedRowValuesString} WHERE ${whereFilterString}`;
    }
}