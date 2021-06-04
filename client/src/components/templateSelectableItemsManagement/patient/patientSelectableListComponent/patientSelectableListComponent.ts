import { EventEmitter, Output, Component, ViewChild } from "@angular/core";
import { DataService } from "../../../../provider/dataService";
import { ToastService } from "../../../../provider/toastService";
import { StringHelper } from "../../../../helpers/stringHelper";
import { SelectableItemHtmlService, SelectableItem } from "../../../../provider/selectableItemHtmlService";
import { BaseSelectableListComponent } from "../../base/baseSelectableListComponent";
import { BaseSelectableComponent } from "../../base/baseSelectableComponent";
import { DxPopupComponent, DxTextAreaComponent } from "devextreme-angular";

@Component({
    templateUrl: 'patientSelectableListComponent.html',
    selector: 'patient-selectable-list'
})
export class PatientSelectableListComponent extends BaseSelectableListComponent
    implements IPatientSelectableComponent {

    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    @ViewChild("selectablePopup") selectablePopup: DxPopupComponent;
    @ViewChild("selectableItemResultTextarea") selectableItemResultTextarea: DxTextAreaComponent;

    private _selectableItem: SelectableItem = null;

    selectableItemValues: Array<any> = [];
    selectableItemResult: string = "";

    isPreviewMode: boolean = false;

    selectedSelectableItemValues: Array<string> = [];

    constructor(
        private dataService: DataService,
        private toastService: ToastService,
        selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    get selectableItem(): SelectableItem {
        return this._selectableItem;
    };

    set selectableItem(selectableItem: SelectableItem) {
        const self = this;
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            const metadata = this.getMetadata(this._selectableItem.metadata);
            const selectableItemName = metadata.selectableItemName;
            const categoryName = metadata.categoryName;
            this.dataService
                .getTemplateLookupItemValuesByNameCategoryName(selectableItemName, categoryName)
                .then(selectableItemValues => {
                    self.selectableItemValues = selectableItemValues
                        .map(s => s.Value);

                    if (self.selectableItem.value !== self.getDefaultSelectableItemValue(selectableItemValues)) {
                        self.selectableItemResult = self.selectableItem.value;
                    }
                    self.selectablePopup.instance.show();
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
            this.toastService.showErrorMessage("Please, provide a value", 3000);
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
        this.selectableItemResult += this.selectableItemResult
            ? StringHelper.format(", {0}", selectableItemValue)
            : selectableItemValue;
        this.selectedSelectableItemValues = [];
    }

    public init(htmlContent: string): Promise<Array<SelectableItem>> {
        const self = this;
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

            const cacheKeyFormat = "{0}_{1}";
            const cacheKey = StringHelper.format(cacheKeyFormat, selectableItemName, selectableItemCategoryName);
            const isCachedValueExist = !!cachedValues[cacheKey];
            if (isCachedValueExist) {
                const selectableItemData = new SelectableItem(id, metadata, cachedValues[cacheKey]);
                results.push(selectableItemData);
            }
            else {
                const promise = this.dataService
                    .getTemplateLookupItemValuesByNameCategoryName(selectableItemName, selectableItemCategoryName)
                    .then(selectableItemValues => {
                        const defaultSelectableItemValue =
                            self.getDefaultSelectableItemValue(selectableItemValues);

                        const cacheKey = StringHelper
                            .format(cacheKeyFormat, selectableItemName, selectableItemCategoryName);
                        cachedValues[cacheKey] = defaultSelectableItemValue;

                        const selectableItemData =
                            new SelectableItem(id, metadata, defaultSelectableItemValue);

                        results.push(selectableItemData);
                    })
                    .catch(error => {
                        self.toastService.showErrorMessage(error.message ? error.message : error);
                    })

                promises.push(promise);
            }
        }

        return Promise.all(promises)
            .then(() => {
                return results;
            })
            .catch(error => {
                self.toastService.showErrorMessage(error.message ? error.message : error);
            }) as Promise<Array<SelectableItem>>
    }

    private getDefaultSelectableItemValue(selectableItemValues: Array<any>): any {
        return selectableItemValues.filter(s => s.IsDefault)[0].Value;
    }
}

export interface IPatientSelectableComponent {
    selectableComponent: BaseSelectableComponent
    selectableItem: SelectableItem;
    isPreviewMode: boolean;
    init(htmlContent: string): Promise<Array<SelectableItem>>;
}