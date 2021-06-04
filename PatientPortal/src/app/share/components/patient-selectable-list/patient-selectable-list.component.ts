import { Component, EventEmitter, Output, ViewChild, Input } from "@angular/core";
import { BaseSelectableListComponent } from '../../classes/baseSelectableListComponent';
import { IPatientSelectableComponent } from '../../classes/iPatientSelectableComponent';
import { SelectableItem } from '../../classes/selectableItem';
import { DxPopupComponent, DxTextAreaComponent } from 'devextreme-angular';
import { SelectableItemHtmlService } from '../../../_services/selectable-item-html.service';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    templateUrl: "patient-selectable-list.component.html",
    selector: "patient-selectable-list"
})
export class PatientSelectableListComponent extends BaseSelectableListComponent implements IPatientSelectableComponent {
    @Input() companyId: string;
    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    @ViewChild("selectablePopup", { static: false }) selectablePopup: DxPopupComponent;
    @ViewChild("selectableItemResultTextarea", { static: false }) selectableItemResultTextarea: DxTextAreaComponent;

    private _selectableItem: SelectableItem = null;

    selectableItemValues: Array<any> = [];
    selectableItemResult: string = "";

    isPreviewMode: boolean = false;

    selectedSelectableItemValues: Array<string> = [];

    constructor(selectableItemHtmlService: SelectableItemHtmlService,
        private selectableListService: SelectableListService,
        private alertService: AlertService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    get selectableItem(): SelectableItem {
        return this._selectableItem;
    };

    set selectableItem(selectableItem: SelectableItem) {
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            const metadata = this.getMetadata(this._selectableItem.metadata);
            const selectableListName = metadata.selectableItemName;

            this.selectableListService
                .getSelectableListValues(selectableListName, this.companyId)
                .then(selectableItemValues => {
                    this.selectableItemValues = selectableItemValues
                        .map(s => s.Value);

                    if (this.selectableItem.value !== this.getDefaultSelectableItemValue(selectableItemValues)) {
                        this.selectableItemResult = this.selectableItem.value;
                    }

                    this.selectablePopup.instance.show();
                })
        }
        else {
            this.selectablePopup.instance.hide();
        }
    };

    onSelectablePopupHidden() {
        this.selectableItem = null;
        this.selectedSelectableItemValues = [];
        this.selectableItemResult = "";
    }

    saveSelectbleItemChanges() {
        if (!this.selectableItemResult) {
            this.alertService.error("Please, provide a value");
            return;
        }
        else {
            this.selectableItem.value = this.selectableItemResult;
            this.onSelectableItemChanged.next([this.selectableItem]);
            this.selectablePopup.instance.hide();
        }
    }

    applySelectableItemValue($event) {
        const addedItems = $event.addedItems;
        if (!addedItems.length) {
            return;
        }
        const selectableItemValue = addedItems[0];
        this.selectableItemResult += this.selectableItemResult ? `, ${selectableItemValue}` : selectableItemValue;

        this.selectedSelectableItemValues = [];
    }

    getSelecatbleItems(htmlContent: string): Promise<SelectableItem[]> {
        const selectableItems =
            this.selectableItemHtmlService.getSelectableItems(htmlContent, [this.metadataCodeRegexp], null,
                selectableItem => {
                    return !!selectableItem.value.match(selectableItem.metadata)
                });
        if (!selectableItems || !selectableItems.length) {
            return Promise.resolve([]);
        }

        const results: Array<SelectableItem> = [];
        const promises = [];
        const cachedValues = {};

        for (let i = 0; i < selectableItems.length; i++) {
            const selectableItem = selectableItems[i];
            const selectableItemMetadata = this
                .getMetadata(selectableItem.metadata);

            const id = selectableItem.id;
            const metadata = selectableItem.metadata;

            const selectableItemName = selectableItemMetadata.selectableItemName;
            const selectableItemCategoryName = selectableItemMetadata.categoryName;

            const cacheKey = `${selectableItemName}_${selectableItemCategoryName}`;

            const isCachedValueExist = !!cachedValues[cacheKey];
            if (isCachedValueExist) {
                const selectableItemData = new SelectableItem(id, metadata, cachedValues[cacheKey]);
                results.push(selectableItemData);
            }
            else {
                const promise = this.selectableListService
                    .getSelectableListValues(selectableItemName, this.companyId)
                    .then(selectableItemValues => {
                        const defaultSelectableItemValue =
                            this.getDefaultSelectableItemValue(selectableItemValues);

                        const cacheKey = `${selectableItemName}_${selectableItemCategoryName}`;
                        cachedValues[cacheKey] = defaultSelectableItemValue;

                        const selectableItemData =
                            new SelectableItem(id, metadata, defaultSelectableItemValue);

                        results.push(selectableItemData);
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));

                promises.push(promise);
            }
        }

        return Promise.all(promises)
            .then(() => {
                return results;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error)) as Promise<SelectableItem[]>
    }

    private getDefaultSelectableItemValue(selectableItemValues: Array<any>): any {
        const defaultSelectableListItem =
            selectableItemValues.filter(s => s.IsDefault)[0];

        return defaultSelectableListItem
            ? defaultSelectableListItem.Value 
            : "DEFAULT VALUE IS NOT SET";
    }
}