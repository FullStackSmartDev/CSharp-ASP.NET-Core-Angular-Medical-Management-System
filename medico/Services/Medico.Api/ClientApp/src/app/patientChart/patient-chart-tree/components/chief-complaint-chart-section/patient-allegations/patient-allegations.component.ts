import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
    templateUrl: "patient-allegations.component.html",
    selector: "patient-allegations"
})

export class PatientAllegationsComponent implements OnInit {
    private _separator: string = ", ";

    @Input("addingAllegationsEnabled") addingAllegationsEnabled: boolean;

    @Input("appointmentAllegations")
    appointmentAllegations: string[];

    @Input("allegationSet")
    allegationSet: string

    ngOnInit() {
        this.setSelectedAllegations();
    }

    @Output() onAllegationsAdded: EventEmitter<string> = new EventEmitter<string>();

    selectedAllegations: string[] = [];

    initiallySelectedAllegations: string[] = [];

    appointmentAllegationStringList: string[] = [];

    addToAllegationSet() {
        const allegationSetString = this.allegationSet;
        let newAllegationSet;

        if (allegationSetString) {
            let allegationsFromSet =
                allegationSetString.split(this._separator);

            const allegationsToRemove = this.initiallySelectedAllegations
                .filter(a => this.selectedAllegations.indexOf(a) === -1);

            if (allegationsToRemove.length)
                allegationsFromSet = allegationsFromSet
                    .filter(a => allegationsToRemove.indexOf(a) === -1);

            const allegationsToAdd = this.selectedAllegations
                .filter(a => this.initiallySelectedAllegations.indexOf(a) === -1);

            if (allegationsToAdd.length)
                allegationsFromSet.push(...allegationsToAdd);

            newAllegationSet = allegationsFromSet
                .join(this._separator);
        }
        else {
            newAllegationSet = this.selectedAllegations
                .join(this._separator);
        }

        this.onAllegationsAdded.next(newAllegationSet);
    }

    private setSelectedAllegations() {
        if (this.allegationSet) {
            const allegationsFromSet = this.allegationSet.split(this._separator);

            const selectedAllegations = allegationsFromSet
                .filter(a => this.appointmentAllegations.indexOf(a) !== -1);

            if (!selectedAllegations.length)
                return;

            this.initiallySelectedAllegations = selectedAllegations;
            this.selectedAllegations.push(...selectedAllegations);
        }
    }
}