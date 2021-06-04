import { ArrayHelper } from "../../helpers/arrayHelper";
import { SqlSource } from "./sqlSource";
import { SqlFilterExpressionConverter } from "./sqlFilterExpressionConverter";
import { Injectable } from "@angular/core";

@Injectable()
export class SqlFilterConverter {
    constructor(private sqlFilterExpressionConverter: SqlFilterExpressionConverter) { }

    convertToSqlFilters(dxFilterItems: Array<any>, sqlSource: SqlSource) {
        const filterHasMultipleConditions = ArrayHelper
            .isArray(dxFilterItems[0]);

        if (!filterHasMultipleConditions) {
            return this.convertToSqlFilter(dxFilterItems, sqlSource);
        }

        let sqlConditionStatement = "";

        for (let i = 0; i < dxFilterItems.length; i++) {
            const dxFilterItem = dxFilterItems[i];
            sqlConditionStatement += this
                .convertToSqlFilter(dxFilterItem, sqlSource);

            if (i !== dxFilterItems.length - 1) {
                sqlConditionStatement += " ";
            }
        }

        return sqlConditionStatement;
    }

    private convertToSqlFilter(dxFilterItem: any, sqlSource: SqlSource): string {
        if (typeof dxFilterItem === "string") {
            return dxFilterItem;
        }

        if (!Array.isArray(dxFilterItem)) {
            throw "Dx filter item have to be a 'string' or an 'array'"
        }

        const dxFilterExpression = dxFilterItem[1];
        const dxFilteredValue = dxFilterItem[2];
        const dxRequestedColumnName = dxFilterItem[0];

        const sqlColumnName = sqlSource
            .getSourceColumnByName(dxRequestedColumnName)
            .sqlColumn
            .sqlColumnName;

        return this.sqlFilterExpressionConverter
            .convertToSqlFilterExpression(sqlColumnName, dxFilterExpression, dxFilteredValue);
    }
}