import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    templateUrl: 'patient-last-visit.component.html',
    selector: 'patient-last-visit'
})

export class PatientLastVisitComponent implements OnInit {
    @Input() previousAppointmentDate: any;
    @Input() startDate: any;

    lastVisitMessage: string = "";

    ngOnInit() {
        this.setLastVisitAppointmentMessage(this.previousAppointmentDate)
    }

    private setLastVisitAppointmentMessage(lastVisitDate: Date) {
        this.lastVisitMessage = "New visit";
        if (!lastVisitDate)
            return;
        const daysCountBetweenDates = this.getDaysCountBetweenDates(lastVisitDate);
        if (daysCountBetweenDates === 0) {
            this.lastVisitMessage = "Today"
            return;
        }
        if (daysCountBetweenDates === 1) {
            this.lastVisitMessage = "Yesterday"
            return
        }

        this.lastVisitMessage = `${daysCountBetweenDates} days ago`;
    }

    private getDaysCountBetweenDates(lastVisitDate: any): number {
        const startDate = moment(this.startDate);
        const endDate = moment(lastVisitDate);
        const duration = moment.duration(startDate.diff(endDate));
        return Math.trunc(duration.asDays());
    }
}