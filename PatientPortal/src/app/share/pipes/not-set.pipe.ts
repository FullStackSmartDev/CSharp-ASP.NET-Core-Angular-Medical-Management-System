import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from 'src/app/_classes/constants';

@Pipe({ name: 'notSet' })
export class NotSetPipe implements PipeTransform {
    transform(value: any, exponent: string): any {
        return !!value ? value : Constants.messages.notSet;
    }
}