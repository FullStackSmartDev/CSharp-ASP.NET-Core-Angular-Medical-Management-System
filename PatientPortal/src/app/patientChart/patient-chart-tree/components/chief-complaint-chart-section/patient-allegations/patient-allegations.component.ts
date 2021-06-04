import { Component, Input } from "@angular/core";
import { PatientAllegationsSet } from 'src/app/patientChart/models/patientAllegationsSet';

@Component({
    templateUrl: "patient-allegations.component.html",
    selector: "patient-allegations",
    styleUrls: ['./patient-allegations.component.sass']
})

export class PatientAllegationsComponent {
    private _separator: ", ";
    private _patientAllegationsSet: PatientAllegationsSet;

    @Input("addingAllegationsEnabled") addingAllegationsEnabled: boolean;

    @Input("appointmentAllegations")
    set appointmentAllegations(appointmentAllegations: string[]) {
        this.setAppointmentAllegationsString(appointmentAllegations);
        this.setAppointmentAllegationStringList(appointmentAllegations);
    }

    @Input("allegationSet")
    set allegationSet(patientAllegationsSet: PatientAllegationsSet) {
        this._patientAllegationsSet = patientAllegationsSet;
        this.setSelectedAllegations();
    }

    isAllegationsPopupOpened: boolean = false;

    selectedAllegations: string[] = [];
    appointmentAllegationStringList: string[] = [];
    appointmentAllegationsString: string = "";

    addToAllegationSet() {
        const allegationSetString = this._patientAllegationsSet.allegations;
        if (allegationSetString) {
            const alreadySavedAllegations = allegationSetString.split(this._separator);
            this._patientAllegationsSet.allegations = alreadySavedAllegations
                .concat(this.selectedAllegations)
                .join(this._separator);
        }
        else {
            this._patientAllegationsSet.allegations = this.selectedAllegations
                .join(this._separator);
        }

        this.isAllegationsPopupOpened = false;
    }

    onChiefComplaintAllegationsClick() {
        if (!this.appointmentAllegationsString)
            return;

        this.isAllegationsPopupOpened = true;
    }

    private setSelectedAllegations() {
        const allegationSetString = this._patientAllegationsSet.allegations;

        if (allegationSetString) {
            const selectedAllegations = allegationSetString.split(this._separator);
            this.selectedAllegations = selectedAllegations;
        }
    }

    private setAppointmentAllegationsString(appointmentAllegations: string[]) {
        if (appointmentAllegations && appointmentAllegations.length) {
            this.appointmentAllegationsString = appointmentAllegations.join(this._separator);
        }
    }

    private setAppointmentAllegationStringList(appointmentAllegations: string[]) {
        if (appointmentAllegations && appointmentAllegations.length) {
            this.appointmentAllegationStringList = appointmentAllegations;
        }
    }
}