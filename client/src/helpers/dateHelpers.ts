import * as moment from 'moment';

export class DateHelper {
    static getAge(dateOfBirth: Date): number {
        const now = new Date();

        var years = (now.getFullYear() - dateOfBirth.getFullYear());

        if (now.getMonth() < dateOfBirth.getMonth() ||
            now.getMonth() == dateOfBirth.getMonth() && now.getDate() < dateOfBirth.getDate()) {
            years--;
        }

        return years;
    }

    static getDaysBetween(startDate: Date, endDate: Date = null): number {
        const end = endDate ? endDate : new Date();
        const timeDiff = Math.abs(end.getTime() - startDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    static getFullDate(date: any): string {
        return moment(date).format("MMMM Do YYYY, h:mm");
    }

    static getTime(date: any): string {
        return moment(date).locale("en").format("HH:mm")
    }
}