import { ViewChild, Component, Output, EventEmitter } from "@angular/core";
import { BaseSelectableDateComponent } from '../../classes/baseSelectableDateComponent';
import { IPatientSelectableComponent } from '../../classes/iPatientSelectableComponent';
import { SelectableItem } from '../../classes/selectableItem';
import { DxPopupComponent } from 'devextreme-angular';
import { AlertService } from 'src/app/_services/alert.service';
import { SelectableItemHtmlService } from '../../../_services/selectable-item-html.service';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';
import * as moment from 'moment';

@Component({
    templateUrl: 'patient-selectable-date.component.html',
    selector: 'patient-selectable-date'
})
export class PatientSelectableDateComponent extends BaseSelectableDateComponent implements IPatientSelectableComponent {

    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    private _selectableItem: SelectableItem = null;

    @ViewChild("selectableDatePopup", { static: false }) selectableDatePopup: DxPopupComponent;

    dateFormat: string = "";
    date: string = "";

    isPreviewMode: boolean = false;

    constructor(private alertService: AlertService,
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
            this.alertService.error("Invaid date format");
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

    getSelecatbleItems(htmlContent: string): Promise<Array<SelectableItem>> {
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