import { Component, Input } from '@angular/core';
import { AppointmentAllegation } from '../appointmentAllegationsComponent/appointmentAllegationsComponent';
import { PatientAllegationsSet } from '../../dataModels/patientAllegationsSet';

@Component({
    templateUrl: 'chiefComplaintAllegationsComponent.html',
    selector: 'chief-complaint-allegations'
})

export class ChiefComplaintAllegationsComponent {
    private _separator: ", ";
    private _patientAllegationsSet: PatientAllegationsSet;

    @Input("addingAllegationsEnabled") addingAllegationsEnabled: boolean;

    @Input("appointmentAllegations")
    set appointmentAllegations(appointmentAllegations: AppointmentAllegation[]) {
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
        const allegationSetString = this._patientAllegationsSet.Allegations;
        if (allegationSetString) {
            const alreadySavedAllegations = allegationSetString.split(this._separator);
            this._patientAllegationsSet.Allegations = alreadySavedAllegations
                .concat(this.selectedAllegations)
                .join(this._separator);
        }
        else {
            this._patientAllegationsSet.Allegations = this.selectedAllegations
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
        const allegationSetString = this._patientAllegationsSet.Allegations;

        if (allegationSetString) {
            const selectedAllegations = allegationSetString.split(this._separator);
            this.selectedAllegations = selectedAllegations;
        }
    }

    private setAppointmentAllegationsString(appointmentAllegations: AppointmentAllegation[]) {
        if (appointmentAllegations && appointmentAllegations.length) {
            this.appointmentAllegationsString = appointmentAllegations.map(a => a.Keyword)
                .join(this._separator);
        }
    }

    private setAppointmentAllegationStringList(appointmentAllegations: AppointmentAllegation[]) {
        if (appointmentAllegations && appointmentAllegations.length) {
            this.appointmentAllegationStringList = appointmentAllegations.map(a => a.Keyword);
        }
    }
}