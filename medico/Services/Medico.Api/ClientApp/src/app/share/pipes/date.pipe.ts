import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Pipe({ name: 'localDate' })
export class LocaDatePipe implements PipeTransform {
    transform(value: string, exponent: string): string {
        const localDate = DateHelper.sqlServerUtcDateToLocalJsDate(value);
        return moment(localDate).format('LL');
    }
}

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
    transform(value: number, exponent: string): string {
        const formaDate = moment(value).format('LL');
        return formaDate;
    }
}

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
    transform(value: number, exponent: string): string {
        return moment(value).locale("en").format("HH:mm");
    }
}

@Pipe({ name: 'age' })
export class AgePipe implements PipeTransform {
    transform(value: Date, exponent: string): number {
        return DateHelper.getAge(value);
    }
}