import { Component, Output, EventEmitter } from "@angular/core";
import { IPatientSelectableComponent } from "../../classes/iPatientSelectableComponent";
import { SelectableItem } from "../../classes/selectableItem";
import { BaseSelectableVariableComponent } from '../../classes/baseSelectableVariableComponent';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';
import { SelectableVariableType } from 'src/app/_models/selectableVariableType';
import { AlertService } from 'src/app/_services/alert.service';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';

@Component({
    templateUrl: "patient-selectable-variable.component.html",
    selector: "patient-selectable-variable"
})
export class PatientSelectableVariableComponent extends BaseSelectableVariableComponent implements IPatientSelectableComponent {
    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<SelectableItem[]>
        = new EventEmitter();

    private _selectableItem: SelectableItem = null;
    private variableType: SelectableVariableType;

    variableValue: any;

    get isTextVariable(): boolean {
        return this.variableType === SelectableVariableType.Text;
    }

    get isNumericVariable(): boolean {
        return this.variableType === SelectableVariableType.Numeric;
    }

    isPreviewMode: boolean = false;
    visible: boolean = false;

    set selectableItem(selectableItem: SelectableItem) {
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            const metadata = this.getMetadata(selectableItem.metadata);
            this.variableType = metadata.variableType;
        }
    }

    get selectableItem() {
        return this._selectableItem;
    }

    constructor(private alertService: AlertService,
        private selectableItemHtmlService: SelectableItemHtmlService) {
        super();
    }

    saveSelectbleItemChanges() {
        if (!this.variableValue) {
            this.alertService.error("Variable value is required");
            return;
        }
        else {
            this.selectableItem.value = this.variableValue;
            this.onSelectableItemChanged.next([this.selectableItem]);
        }
    }

    getSelecatbleItems(htmlContent: string): Promise<SelectableItem[]> {
        const selectableItems =
            this.selectableItemHtmlService.getSelectableItems(htmlContent, [this.selectableType], null);
        if (!selectableItems || !selectableItems.length) {
            return Promise.resolve([]);
        }

        const results: Array<SelectableItem> = [];

        for (let i = 0; i < selectableItems.length; i++) {
            const selectableItem = selectableItems[i];
            const metadataCode = selectableItem.metadata;
            const id = selectableItem.id;

            results.push(new SelectableItem(id, metadataCode, "variable"));
        }

        return Promise.resolve(results);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }
}