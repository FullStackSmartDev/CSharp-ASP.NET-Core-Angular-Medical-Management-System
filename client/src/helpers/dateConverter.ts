import * as moment from 'moment';

export class DateConverter {

    static jsLocalDateToSqlServerUtc(dateString: string): string {
        return moment.utc(dateString).toISOString();
    }

    static sqlServerUtcDateToLocalJsDate(sqlServerUtcDateString: string): Date {
        const localDate = new Date(moment(sqlServerUtcDateString)
            .locale("en").format('YYYY-MM-DD HH:mm:ss'));;
        return localDate;
    }
}