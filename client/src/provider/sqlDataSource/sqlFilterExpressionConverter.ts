import { SqlValuesProvider } from "./sqlQueryStringProviders/sqlValuesProvider";
import { Injectable } from "@angular/core";

@Injectable()
export class SqlFilterExpressionConverter {
    constructor(private sqlValuesProvider: SqlValuesProvider) { }

    convertToSqlFilterExpression(columnName: string,
        filterExpression: string, filteredValue: any): string {

        const sqlValue = this.sqlValuesProvider
            .getSqlValue(filteredValue);

        const originalStringValue = sqlValue.originalStringValue;
        const sqlFormattedStringValue = sqlValue.sqlFormattedStringValue;

        let filterExpressionString = "";
        switch (filterExpression) {
            case "contains":
                filterExpressionString = `LIKE '%${originalStringValue}%'`;
                break;

            case "startswith":
                filterExpressionString = `LIKE '${originalStringValue}%'`;
                break;

            case "=":
                filterExpressionString = `= ${sqlFormattedStringValue}`;
                break;

            case "<=":
                filterExpressionString = `<= ${sqlFormattedStringValue}`;
                break;

            case ">=":
                filterExpressionString = `>= ${sqlFormattedStringValue}`;
                break;

            case ">":
                filterExpressionString = `> ${sqlFormattedStringValue}`;
                break;

            case "<":
                filterExpressionString = `< ${sqlFormattedStringValue}`;
                break;
        }

        if (!filterExpressionString) {
            throw `Dx condition of type '${filterExpression}' is not supported`;
        }

        return `${columnName} ${filterExpressionString}`;
    }
}