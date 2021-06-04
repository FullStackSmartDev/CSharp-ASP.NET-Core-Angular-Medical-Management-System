import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { AllegationsNotesStatusService } from '../../../services/allegations-notes-status.service';
import { AlertService } from 'src/app/_services/alert.service';
import { AllegationsNotesStatus } from 'src/app/patientChart/models/allegationsNotesStatus';

@Component({
    templateUrl: 'allegations-notes-status.component.html',
    selector: "allegations-notes-status"
})

export class AllegationsNotesStatusComponent implements OnInit {
    @Input("appointmentId") appointmentId: string;

    admissionId: string = "";

    isAllegationsNotesPopoverVisible: boolean = false;

    allegationsNotes: string = "";

    areAllegationsNotesReviewed: boolean = false;

    constructor(private appointmentService: AppointmentService,
        private allegationsNotesStatusService: AllegationsNotesStatusService,
        private alertService: AlertService) {
    }

    get areAllegationsNotesSet(): boolean {
        return !!this.allegationsNotes;
    }

    ngOnInit(): void {
        this.appointmentService.getById(this.appointmentId)
            .then(appointment => {
                this.allegationsNotes = appointment.allegationsNotes;
                this.admissionId = appointment.admissionId;

                this.setAllegationsNotesCondition(appointment.admissionId);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    toggleAllegationsNotesPopover(): void {
        if (!this.areAllegationsNotesReviewed && !this.isAllegationsNotesPopoverVisible) {
            const allegationsNotesStatus = new AllegationsNotesStatus(this.admissionId, true);

            this.allegationsNotesStatusService.save(allegationsNotesStatus)
                .then(() => {
                    this.isAllegationsNotesPopoverVisible = true;
                    this.areAllegationsNotesReviewed = true;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));

        }
        else
            this.isAllegationsNotesPopoverVisible = !this.isAllegationsNotesPopoverVisible;
    }

    private setAllegationsNotesCondition(admissionId: string) {
        this.allegationsNotesStatusService.getByAdmissionId(admissionId)
            .then(allegationsNotesStatus => {
                if (allegationsNotesStatus)
                    this.areAllegationsNotesReviewed = allegationsNotesStatus.isReviewed;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}