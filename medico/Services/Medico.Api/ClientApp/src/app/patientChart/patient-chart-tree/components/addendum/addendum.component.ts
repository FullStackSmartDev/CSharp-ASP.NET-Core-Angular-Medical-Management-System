import { Component, Input, OnInit } from "@angular/core";
import { PatientChartTrackService } from 'src/app/_services/patient-chart-track.service';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Component({
    templateUrl: "addendum.component.html",
    selector: "addendum"
})

export class AddendumComponent implements OnInit {
    @Input() patientChartNode: PatientChartNode;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    addendumText: string = "";

    constructor(private patientChartTrackService: PatientChartTrackService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.patientChartNode)
            this.addendumText = this.patientChartNode.value;
    }

    onPhraseSuggestionApplied($event) {
        this.addendumText = $event;
    }

    saveAddendum() {
        this.patientChartNode.value = this.addendumText;
        this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.AddendumNode);
        this.alertService.info("Addendum was successfully saved");
    }
}