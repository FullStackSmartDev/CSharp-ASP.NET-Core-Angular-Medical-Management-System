import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_services/alert.service';
import { AppointmentService } from '../../../_services/appointment.service';
import { Appointment } from '../../../_models/appointment';
import * as moment from 'moment';

@Component({
    templateUrl: 'patient-last-visit.component.html',
    selector: 'patient-last-visit'
})

export class PatientLastVisitComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("startDate") startDate: any;

    lastVisitMessage: string = "";

    constructor(private appointmentService: AppointmentService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        this.getPatientLastVisit()
            .then(lastVisit => {
                const lastVisitDate = lastVisit
                    ? lastVisit.startDate
                    : null;

                this.setLastVisitAppointmentMessage(lastVisitDate);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private getPatientLastVisit(): Promise<Appointment> {
        return this.appointmentService
            .getPatientLastVisit(this.patientId, this.startDate);
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