import { Component, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { PatientSelectableListComponent, IPatientSelectableComponent } from "../patientSelectableListComponent/patientSelectableListComponent";
import { SelectableItem } from "../../../../provider/selectableItemHtmlService";
import { PatientSelectableRangeComponent } from "../patientSelectableRangeComponent/patientSelectableRangeComponent";
import { PatientSelectableDateComponent } from "../patientSelectableDateComponent/patientSelectableDateComponent";

@Component({
    templateUrl: 'patientSelectableRootComponent.html',
    selector: 'patient-selectable-root'
})
export class PatientSelectableRootComponent implements AfterViewInit {
    @Output("onSelectableItemValueChanged") onSelectableItemsValuesChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    @ViewChild("patientSelectableList") patientSelectableList: PatientSelectableListComponent;
    @ViewChild("patientSelectableRange") patientSelectableRange: PatientSelectableRangeComponent;
    @ViewChild("patientSelectableDate") patientSelectableDate: PatientSelectableDateComponent;

    _selectableComponents: Array<IPatientSelectableComponent>;

    constructor() { }

    onChildSelectableItemsValuesChanged($event){
        this.onSelectableItemsValuesChanged.next($event);
    }

    ngAfterViewInit(): void {
        this._selectableComponents = [
            this.patientSelectableList,
            this.patientSelectableRange,
            this.patientSelectableDate
        ];
    }

    tryExecuteSelectableItem(htmlElement: HTMLElement, isPreviewMode: boolean) {
        for (let i = 0; i < this._selectableComponents.length; i++) {
            const selectableItemResult = this._selectableComponents[i]
                .selectableComponent
                .tryGetSelectableItem(htmlElement);
            if (selectableItemResult.success) {
                const selectableComponent = this._selectableComponents[i];

                if(isPreviewMode){
                    selectableComponent.isPreviewMode = true;
                }

                selectableComponent.selectableItem =
                    selectableItemResult.selectableItem;
                break;
            }
        }
    }

    initSelectableItems(htmlContent: string) {
        const initialSelectableListValues =
            this.patientSelectableList.init(htmlContent);
        const initialSelectableRangeValues =
            this.patientSelectableRange.init(htmlContent);
        const initialSelectableDateValues =
            this.patientSelectableDate.init(htmlContent);

        return Promise.all([initialSelectableDateValues, initialSelectableListValues, initialSelectableRangeValues])
            .then(result => {
                this.onSelectableItemsValuesChanged
                    .next(result[0]
                        .concat(result[1])
                        .concat(result[2]));
            })
    }
}