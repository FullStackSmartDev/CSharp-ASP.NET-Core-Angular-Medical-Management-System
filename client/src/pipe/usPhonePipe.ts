import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'phone' })
export class UsPhonePipe implements PipeTransform {
    transform(value: string, exponent: string): string {
        return `(${value.substring(0, 3)}) ${value.substring(3, 6)} - ${value.substring(6)}`;
    }
}