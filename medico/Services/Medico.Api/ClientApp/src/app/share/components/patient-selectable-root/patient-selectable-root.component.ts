import { Component, AfterViewInit, EventEmitter, Output, ViewChild, Input } from "@angular/core";
import { SelectableItem } from "../../classes/selectableItem";
import { PatientSelectableListComponent } from "../patient-selectable-list/patient-selectable-list.component";
import { IPatientSelectableComponent } from "../../classes/iPatientSelectableComponent";
import { PatientSelectableRangeComponent } from "../patient-selectable-range/patient-selectable-range.component";
import { PatientSelectableDateComponent } from "../patient-selectable-date/patient-selectable-date.component";
import { PatientSelectableVariableComponent } from '../patient-selectable-variable/patient-selectable-variable.component';

@Component({
    templateUrl: "patient-selectable-root.component.html",
    selector: "patient-selectable-root"
})
export class PatientSelectableRootComponent implements AfterViewInit {
    @Input() companyId: string;
    @Output("onSelectableItemValueChanged") onSelectableItemsValuesChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    @ViewChild("patientSelectableList", { static: false }) patientSelectableList: PatientSelectableListComponent;
    @ViewChild("patientSelectableRange", { static: false }) patientSelectableRange: PatientSelectableRangeComponent;
    @ViewChild("patientSelectableDate", { static: false }) patientSelectableDate: PatientSelectableDateComponent;
    @ViewChild("patientSelectableVariable", { static: false }) patientSelectableVariable: PatientSelectableVariableComponent;

    _selectableComponents: Array<IPatientSelectableComponent>;

    constructor() { }

    onChildSelectableItemsValuesChanged($event) {
        this.onSelectableItemsValuesChanged.next($event);
    }

    ngAfterViewInit(): void {
        this._selectableComponents = [
            this.patientSelectableList,
            this.patientSelectableRange,
            this.patientSelectableDate,
            this.patientSelectableVariable
        ];
    }

    tryExecuteSelectableItem(htmlElement: HTMLElement, isPreviewMode: boolean) {
        for (let i = 0; i < this._selectableComponents.length; i++) {
            const selectableItemResult = this._selectableComponents[i]
                .selectableComponent
                .tryGetSelectableItem(htmlElement);
                
            if (selectableItemResult.success) {
                const selectableComponent = this._selectableComponents[i];

                //hide previous selectable component if needed it
                const previousSelectableComponent =
                    this._selectableComponents.find(c => c.visible);

                if (previousSelectableComponent)
                    previousSelectableComponent.visible = false;

                selectableComponent.visible = true;

                if (isPreviewMode) {
                    selectableComponent.isPreviewMode = true;
                }

                selectableComponent.selectableItem =
                    selectableItemResult.selectableItem;
                break;
            }
        }
    }

    getAllSelecatbleItems(htmlContent: string): Promise<SelectableItem[]> {
        const initialSelectableListValues =
            this.patientSelectableList.getSelecatbleItems(htmlContent);

        const initialSelectableRangeValues =
            this.patientSelectableRange.getSelecatbleItems(htmlContent);

        const initialSelectableDateValues =
            this.patientSelectableDate.getSelecatbleItems(htmlContent);

        const initialSelectableVariableValues =
            this.patientSelectableVariable.getSelecatbleItems(htmlContent);

        return Promise.all(
            [
                initialSelectableDateValues,
                initialSelectableListValues,
                initialSelectableRangeValues,
                initialSelectableVariableValues
            ])
            .then(result => {
                return result[0]
                    .concat(result[1])
                    .concat(result[2])
                    .concat(result[3]);
            })
    }

    async replaceSelectableItemsCodesWithDefaultValues(htmlContent: string): Promise<string> {
        const selecatbleItems =
            await this.getAllSelecatbleItems(htmlContent);

        return this.getTemplateContentWithDefaultValues(selecatbleItems, htmlContent);
    }

    private getTemplateContentWithDefaultValues(selectableItems: SelectableItem[], templateContent: string): string {
        if (selectableItems.length) {
            const alreadyReplacedItems = [];

            for (let i = 0; i < selectableItems.length; i++) {
                const selectableItem = selectableItems[i];
                const metadata = selectableItem.metadata;
                const value = selectableItem.value;

                if (alreadyReplacedItems.indexOf(metadata) === -1) {
                    const textToReplace = `>${metadata}<`;
                    const regexToReplace = new RegExp(textToReplace, "g");
                    const textValue = `>${value}<`;

                    templateContent = templateContent
                        .replace(regexToReplace, textValue);

                    alreadyReplacedItems.push(metadata);
                }
            }

            return templateContent;
        }

        return templateContent;
    }
}