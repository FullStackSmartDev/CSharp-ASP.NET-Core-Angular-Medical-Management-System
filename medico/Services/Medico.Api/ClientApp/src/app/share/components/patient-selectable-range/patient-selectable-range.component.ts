import { Component, Output, EventEmitter } from "@angular/core";
import { BaseSelectableRangeComponent } from '../../classes/baseSelectableRangeComponent';
import { IPatientSelectableComponent } from '../../classes/iPatientSelectableComponent';
import { SelectableItem } from '../../classes/selectableItem';
import { SelectableItemHtmlService } from '../../../_services/selectable-item-html.service';
import { AlertService } from 'src/app/_services/alert.service';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';

@Component({
    templateUrl: 'patient-selectable-range.component.html',
    selector: 'patient-selectable-range'
})
export class PatientSelectableRangeComponent extends BaseSelectableRangeComponent implements IPatientSelectableComponent {

    private _selectableItem: SelectableItem = null;

    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    rangeValue: string;
    minRangeValue: number;
    maxRangeValue: number;

    isPreviewMode: boolean = false;

    visible: boolean = false;

    constructor(private selectableItemHtmlService: SelectableItemHtmlService,
        private alertService: AlertService) {
        super();
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

            // in template preview mode we should show min value instead of
            // selectable value itself
            this.rangeValue = isNaN(Number(selectableItem.value))
                ? this.minRangeValue.toString()
                : selectableItem.value;
        }
    };

    saveSelectbleItemChanges() {
        if (!this.rangeValue) {
            this.alertService.error("Please, provide a value");
            return;
        }
        else {
            this.selectableItem.value = this.rangeValue;
            this.onSelectableItemChanged.next([this.selectableItem]);
        }
    }

    getSelecatbleItems(htmlContent: string): Promise<Array<SelectableItem>> {
        const selectableItems =
            this.selectableItemHtmlService.getSelectableItems(htmlContent, [this.selectableType], null,
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