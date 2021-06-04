import { SqlSource } from "./sqlSource";
import { Injectable } from "@angular/core";

@Injectable()
export class SqlSortConverter {
    convertToSqlSort(sortItem: any, sqlSource: SqlSource): string {

        const columnName = sortItem.selector;
        const desc = sortItem.desc;

        const sortColumnName = sqlSource
            .getSourceColumnByName(columnName)
            .sqlColumn
            .sqlColumnName;

        const orderBy = desc ? "DESC" : "ASC";

        if (typeof sortItem.nullValuesAtTheEnd === "boolean" && sortItem.nullValuesAtTheEnd) {
            return `ORDER BY CASE WHEN ${sortColumnName} IS NULL THEN 1 ELSE 0 END, ${sortColumnName} ${orderBy}`;
        }

        return `ORDER BY ${sortColumnName} ${orderBy}`;
    }
}