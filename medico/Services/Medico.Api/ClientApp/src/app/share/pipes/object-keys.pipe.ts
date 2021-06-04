import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "keys"})
export class ObjectKeysPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value)
    }
}