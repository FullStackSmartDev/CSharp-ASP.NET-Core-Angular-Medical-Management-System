import * as $ from 'jquery';

export class ObjectHelpers{
    static isObjectEmpty(obj:any): boolean{
        if (obj == null) return true;

        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        if (typeof obj !== "object") return true;

        for (var key in obj) {
          if (obj.hasOwnProperty.call(obj, key)) return false;
        }
    
        return true;
      }

      static clone(obj:any){
        return $.extend({}, obj);
      }
}