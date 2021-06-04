import { Component, Input, OnInit } from "@angular/core";
import { PatientChartTrackService } from 'src/app/_services/patient-chart-track.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    templateUrl: "addendum.component.html",
    selector: "addendum"
})

export class AddendumComponent implements OnInit {
    @Input("patientChartSection") patientChartSection: any;
    @Input("isSignedOff") isSignedOff: boolean;
    @Input("companyId") companyId: string;

    addendumText: string = "";

    constructor(private patientChartTrackService: PatientChartTrackService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.patientChartSection) {
            this.addendumText = this.patientChartSection.value;
        }
    }

    onPhraseSuggestionApplied($event) {
        this.addendumText = $event;
    }

    saveAddendum() {
        this.patientChartSection.value = this.addendumText;
        this.patientChartTrackService.emitPatientChartChanges(true);
        this.alertService.info("Addendum was successfully saved");
    }
}