import * as $ from 'jquery';

export class ObjectHelper {
    static isObjectEmpty(object: any): boolean {
        if (object == null)
            return true;

        if (object.length > 0)
            return false;

        if (object.length === 0)
            return true;

        if (typeof object !== "object")
            return true;

        for (var key in object) {
            if (object.hasOwnProperty.call(object, key))
                return false;
        }

        return true;
    }

    static clone(obj: any) {
        return $.extend({}, obj);
    }

    static copy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}