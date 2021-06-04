import { ViewChild, Component, Output, EventEmitter } from "@angular/core";
import { SelectableItemHtmlService, SelectableItem } from "../../../../provider/selectableItemHtmlService";
import { BaseSelectableDateComponent } from "../../base/baseSelectableDateComponent";
import * as moment from 'moment';
import { BaseSelectableComponent } from "../../base/baseSelectableComponent";
import { IPatientSelectableComponent } from "../patientSelectableListComponent/patientSelectableListComponent";
import { DxPopupComponent } from "devextreme-angular";
import { ToastService } from "../../../../provider/toastService";

@Component({
    templateUrl: 'patientSelectableDateComponent.html',
    selector: 'patient-selectable-date'
})
export class PatientSelectableDateComponent extends BaseSelectableDateComponent
    implements IPatientSelectableComponent {

    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    private _selectableItem: SelectableItem = null;

    @ViewChild("selectableDatePopup") selectableDatePopup: DxPopupComponent;

    dateFormat: string = "";
    date: string = "";

    isPreviewMode: boolean = false;

    constructor(private toastService: ToastService,
        selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    set selectableItem(selectableItem: SelectableItem) {
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            this.dateFormat =
                this.getMetadata(selectableItem.metadata);
            this.date = selectableItem.value;
            this.selectableDatePopup.instance.show();
        }
        else {
            this.selectableDatePopup.instance.hide();
        }
    }

    get selectableItem() {
        return this._selectableItem;
    }

    saveSelectbleItemChanges() {
        const dateFormatRegex = this
            .dateFormats.filter(df => df.format === this.dateFormat)[0].regex;
        if (!this.date || !this.date.match(new RegExp(dateFormatRegex))) {
            this.toastService.showErrorMessage("Invaid date format", 3000);
            return;
        }
        else {
            this.selectableItem.value = this.date;
            this.onSelectableItemChanged.next([this.selectableItem]);
            this.selectableDatePopup.instance.hide();
        }
    }

    onSelectablePopupHidden() {
        this.dateFormat = "";
        this.date = "";
    }

    public init(htmlContent: string): Promise<Array<SelectableItem>> {
        const selectableItems =
            this.selectableItemHtmlService.getSelectableItems(htmlContent, [this.metadataCodeRegexp], null,
                selectableItem => {
                    return !!selectableItem.value.match(selectableItem.metadata)
                });
        if (!selectableItems || !selectableItems.length) {
            return Promise.resolve([]);
        }

        const results: Array<SelectableItem> = [];

        for (let i = 0; i < selectableItems.length; i++) {
            const selectableItem = selectableItems[i];
            const metadataCode = selectableItem.metadata;
            const id = selectableItem.id;

            const selectableItemMetadata =
                this.getMetadata(metadataCode);
            const date = moment().format(selectableItemMetadata);

            results.push(new SelectableItem(id, metadataCode, date));
        }

        return Promise.resolve(results);
    }


}