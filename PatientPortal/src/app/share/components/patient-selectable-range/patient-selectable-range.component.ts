import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { BaseSelectableRangeComponent } from '../../classes/baseSelectableRangeComponent';
import { IPatientSelectableComponent } from '../../classes/iPatientSelectableComponent';
import { SelectableItem } from '../../classes/selectableItem';
import { DxPopupComponent } from 'devextreme-angular';
import { SelectableItemHtmlService } from '../../../_services/selectable-item-html.service';
import { AlertService } from 'src/app/_services/alert.service';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';

@Component({
    templateUrl: 'patient-selectable-range.component.html',
    selector: 'patient-selectable-range'
})
export class PatientSelectableRangeComponent extends BaseSelectableRangeComponent implements IPatientSelectableComponent {

    private _selectableItem: SelectableItem = null;

    @ViewChild("selectableRangePopup", { static: false }) selectableRangePopup: DxPopupComponent;

    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    rangeValue: string;
    minRangeValue: number;
    maxRangeValue: number;

    isPreviewMode: boolean = false;

    constructor(selectableItemHtmlService: SelectableItemHtmlService,
        private alertService: AlertService) {
        super(selectableItemHtmlService);
    }

    get selectableItem(): SelectableItem {
        return this._selectableItem;
    };

    set selectableItem(selectableItem: SelectableItem) {
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            const metadata = this.getMetadata(this._selectableItem.metadata);
            this.minRangeValue = metadata.minRangeValue;
            this.maxRangeValue = metadata.maxRangeValue;
            this.rangeValue = selectableItem.value;
            this.selectableRangePopup.instance.show();
        }
        else {
            this.selectableRangePopup.instance.hide();
        }
    };

    onSelectablePopupHidden() {
        this.selectableItem = null;
    }

    saveSelectbleItemChanges() {
        if (!this.rangeValue) {
            this.alertService.error("Please, provide a value");
            return;
        }
        else {
            this.selectableItem.value = this.rangeValue;
            this.onSelectableItemChanged.next([this.selectableItem]);
            this.selectableRangePopup.instance.hide();
        }
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
            const minRageValue =
                selectableItemMetadata.minRangeValue;
            results.push(new SelectableItem(id, metadataCode, minRageValue));
        }

        return Promise.resolve(results);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }
}