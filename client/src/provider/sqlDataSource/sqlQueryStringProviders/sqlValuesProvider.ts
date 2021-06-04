import { TypeHelper } from "../../../helpers/typeHelper";
import { Injectable } from "@angular/core";
import { DateConverter } from "../../../helpers/dateConverter";

@Injectable()
export class SqlValuesProvider {
    private _sqlValueProviders: Array<ISqlValueProvider> = [];

    constructor() {
        this.initSqlValueProviders();
    }

    getSqlValue(value: any): SqlValue {
        let convertedValue = null;
        for (let i = 0; i < this._sqlValueProviders.length; i++) {
            const sqlValueProvider = this._sqlValueProviders[i];
            const convertionResult = sqlValueProvider.tryGetSqlValue(value);
            if (convertionResult.success) {
                convertedValue = convertionResult.value;
                break;
            }
        }
        if (!convertedValue) {
            throw `Unable to find converter for type: "${value.constructor.name}"`
        }

        return convertedValue;
    }

    private initSqlValueProviders(): any {
        this._sqlValueProviders
            .push(new StringSqlValueProvider());
        this._sqlValueProviders
            .push(new BooleanSqlValueProvider());
        this._sqlValueProviders
            .push(new NullSqlValueProvider());
        this._sqlValueProviders
            .push(new NumberSqlValueProvider());
        this._sqlValueProviders
            .push(new DateSqlValueProvider());
    }
}

class SqlValue {
    originalStringValue: string;
    sqlFormattedStringValue: string;

    constructor(originalStringValue: string, sqlFormattedStringValue: string) {
        this.originalStringValue = originalStringValue;
        this.sqlFormattedStringValue = sqlFormattedStringValue;
    }
}

class SqlConvertionResult {
    value: SqlValue;
    success: boolean;

    constructor(value: SqlValue = null,
        success: boolean = false) {
        this.value = value;
        this.success = success;
    }
}

interface ISqlValueProvider {
    tryGetSqlValue(value: any): SqlConvertionResult;
}

class BooleanSqlValueProvider implements ISqlValueProvider {

    tryGetSqlValue(value: any): SqlConvertionResult {
        const isBooleanValue = TypeHelper.isBoolean(value);
        if (!isBooleanValue) {
            return new SqlConvertionResult();
        }

        value = (value ? 1 : 0).toString();

        return new SqlConvertionResult(new SqlValue(value, value), true);
    }
}

class StringSqlValueProvider implements ISqlValueProvider {

    tryGetSqlValue(value: any): SqlConvertionResult {
        const isStringValue = TypeHelper.isString(value);
        if (!isStringValue) {
            return new SqlConvertionResult();
        }

        const isSingleQuoteExist = value.indexOf("'") !== -1;
        if (isSingleQuoteExist)
            value = value.replace(/'/g, "''");

        const sqlValue = new SqlValue(value, `'${value}'`);
        return new SqlConvertionResult(sqlValue, true);
    }
}

class NullSqlValueProvider implements ISqlValueProvider {

    tryGetSqlValue(value: any): SqlConvertionResult {
        if (value === null) {
            return new SqlConvertionResult(new SqlValue("null", "null"), true);
        }

        return new SqlConvertionResult();
    }
}

class NumberSqlValueProvider implements ISqlValueProvider {

    tryGetSqlValue(value: any): SqlConvertionResult {
        const isNumber = TypeHelper.isNumber(value);
        if (isNumber) {
            return new SqlConvertionResult(new SqlValue(`${value}`, `${value}`), true);
        }

        return new SqlConvertionResult();
    }
}

class DateSqlValueProvider implements ISqlValueProvider {

    tryGetSqlValue(value: any): SqlConvertionResult {
        const isNumber = TypeHelper.isDate(value);
        if (isNumber) {
            const sqlDate = DateConverter
                .jsLocalDateToSqlServerUtc(value);

            return new SqlConvertionResult(new SqlValue(`${sqlDate}`, `'${sqlDate}'`), true);
        }

        return new SqlConvertionResult();
    }
}