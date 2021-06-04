export class TypeHelper {
    static isNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    static isBoolean(value: any): boolean {
        return typeof (value) === "boolean";
    }

    static isDate(value: any): boolean {
        return Object.prototype.toString.call(value) === '[object Date]'
    }

    static isString(value: any) {
        return typeof value === 'string' || value instanceof String;
    }

    static isObjectEmpty() {

    }
}