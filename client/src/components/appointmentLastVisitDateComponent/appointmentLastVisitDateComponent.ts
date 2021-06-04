import { Component, Input, OnInit } from '@angular/core';
import { DateTime } from 'ionic-angular';
import * as moment from 'moment';
import { StringHelper } from '../../helpers/stringHelper';
import { AppointmentDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { Appointment } from '../../dataModels/appointment';
import { AlertService } from '../../provider/alertService';

@Component({
    templateUrl: 'appointmentLastVisitDateComponent.html',
    selector: 'appointment-last-visit'
})

export class AppointmentLastVisitDateComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("startDate") startDate: any;

    lastVisitAppointmentMessage: string = "";

    constructor(private appointmentDataService: AppointmentDataService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        this.getPatientLastVisit(this.patientId, this.startDate)
            .then(lastVisit => {
                const lastVisitDate = lastVisit ? lastVisit.StartDate : null;
                this.setLastVisitAppointmentMessage(lastVisitDate);
            })
            .catch(error => {
                this.alertService.alert(error.message ? error.message : error, "ERROR");
            });
    }

    private getPatientLastVisit(patientId: string, date: any): Promise<Appointment> {
        const patientFilter = ["PatientDemographicId", "=", patientId];
        const nonDeletedItemsFilter = ["IsDelete", "=", false];
        const dateFilter = ["StartDate", "<", date];

        const filter = [patientFilter, "and", nonDeletedItemsFilter, "and", dateFilter];
        const sort = [
            {
                selector: "StartDate",
                desc: true
            }
        ];

        const loadOptions = {
            filter: filter,
            sort: sort
        };

        return this.appointmentDataService.firstOrDefault(loadOptions);
    }

    private setLastVisitAppointmentMessage(lastVisitDate: DateTime) {
        this.lastVisitAppointmentMessage = "New visit";
        if (!lastVisitDate)
            return;
        const daysCountBetweenDates = this.getDaysCountBetweenDates(lastVisitDate);
        if (daysCountBetweenDates === 0) {
            this.lastVisitAppointmentMessage = "Today"
            return;
        }
        if (daysCountBetweenDates === 1) {
            this.lastVisitAppointmentMessage = "Yesterday"
            return
        }

        this.lastVisitAppointmentMessage = StringHelper.format("{0} days ago", daysCountBetweenDates.toString());
    }

    private getDaysCountBetweenDates(lastVisitDate: any): number {
        const startDate = moment(this.startDate);
        const endDate = moment(lastVisitDate);
        const duration = moment.duration(startDate.diff(endDate));
        return Math.trunc(duration.asDays());
    }
}