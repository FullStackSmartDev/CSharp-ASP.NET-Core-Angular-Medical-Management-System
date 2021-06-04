import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'notSet' })
export class NotSetPipe implements PipeTransform {
    transform(value: any, exponent: string): any {
        return !!value ? value : "not set";
    }
}