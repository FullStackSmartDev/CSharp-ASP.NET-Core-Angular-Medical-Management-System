import { SqlSource } from "../sqlSource";
import { SqlValuesProvider } from "./sqlValuesProvider";
import { Injectable } from "@angular/core";

@Injectable()
export class InsertSqlStringProvider {
    constructor(private sqlValueProvider: SqlValuesProvider) {
    }

    getSqlInsertString(dataModels: Array<any>, sqlSource: SqlSource) {
        const insertedColumnsString = sqlSource
            .columnNames
            .join(", ");

        const sqlSourceString = sqlSource.sqlSourceString;

        const insertedColumnsValuesString =
            this.getInsertedRowsValues(dataModels, sqlSource);

        return `INSERT INTO ${sqlSourceString}(${insertedColumnsString}) VALUES ${insertedColumnsValuesString}`;
    }

    private getInsertedRowsValues(dataModels: any[], sqlSource: SqlSource): string {
        let insertedColumnsValuesString = "";
        dataModels.forEach((m, index) => {
            insertedColumnsValuesString += this.
                getInsertedRowValues(m, sqlSource);
            if (index !== dataModels.length - 1) {
                insertedColumnsValuesString += ", ";
            }
        })
        return insertedColumnsValuesString;
    }

    private getInsertedRowValues(dataModel: any, sqlSource: SqlSource): string {
        let insertedRowValuesString = "(";
        const insertedColumnNames = sqlSource.columnNames;

        insertedColumnNames.forEach((cn, index) => {
            const columnValue = dataModel[cn];
            const convertedSqlColumnValue =
                this.sqlValueProvider.getSqlValue(columnValue);

            insertedRowValuesString += convertedSqlColumnValue
                .sqlFormattedStringValue;

            if (index !== insertedColumnNames.length - 1) {
                insertedRowValuesString += ", ";
            }
        })

        return insertedRowValuesString += ")";
    }
}