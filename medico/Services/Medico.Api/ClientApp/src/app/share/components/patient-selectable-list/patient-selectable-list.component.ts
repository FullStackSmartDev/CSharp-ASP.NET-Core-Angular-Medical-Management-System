import { Component, EventEmitter, Output, ViewChild, Input, OnInit } from "@angular/core";
import { BaseSelectableListComponent } from '../../classes/baseSelectableListComponent';
import { IPatientSelectableComponent } from '../../classes/iPatientSelectableComponent';
import { SelectableItem } from '../../classes/selectableItem';
import { DxTextAreaComponent } from 'devextreme-angular';
import { SelectableItemHtmlService } from '../../../_services/selectable-item-html.service';
import { BaseSelectableComponent } from '../../classes/baseSelectableComponent';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { AlertService } from 'src/app/_services/alert.service';
import { BaseSelectableListService } from 'src/app/_services/base-selectable-list.service';
import { LibrarySelectableListService } from 'src/app/administration/services/library/library-selectable-list.service';

@Component({
    templateUrl: "patient-selectable-list.component.html",
    selector: "patient-selectable-list"
})
export class PatientSelectableListComponent extends BaseSelectableListComponent implements OnInit, IPatientSelectableComponent {
    @Input() companyId: string;
    @Output("onSelectableItemChanged") onSelectableItemChanged: EventEmitter<Array<SelectableItem>>
        = new EventEmitter();

    @ViewChild("selectableItemResultTextarea", { static: false }) selectableItemResultTextarea: DxTextAreaComponent;

    private _selectableItem: SelectableItem = null;
    private _selectableListService: BaseSelectableListService

    selectableItemValues: Array<any> = [];
    selectableItemResult: string = "";

    isPreviewMode: boolean = false;

    visible: boolean = false;

    selectedSelectableItemValues: Array<string> = [];

    constructor(private selectableItemHtmlService: SelectableItemHtmlService,
        private alertService: AlertService,
        private selectableListService: SelectableListService,
        private librarySelectableListService: LibrarySelectableListService) {
        super();
    }

    ngOnInit(): void {
        this.initSelectableListService();
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    get selectableItem(): SelectableItem {
        return this._selectableItem;
    };

    get isLibrarySelectableList(): boolean {
        return !this.companyId;
    }

    set selectableItem(selectableItem: SelectableItem) {
        this._selectableItem = selectableItem;
        if (this._selectableItem) {
            const metadata = this.getMetadata(this._selectableItem.metadata);
            const selectableListId = metadata;

            this._selectableListService
                .getSelectableListValuesById(selectableListId)
                .then(selectableItemValues => {
                    this.selectableItemValues = selectableItemValues
                        .map(s => s.value);

                    if (this.selectableItem.value !== this.getDefaultSelectableItemValue(selectableItemValues)) {
                        this.selectableItemResult = this.selectableItem.value;
                    }
                })
        }
    };

    saveSelectbleItemChanges() {
        if (!this.selectableItemResult) {
            this.alertService.error("Please, provide a value");
            return;
        }
        else {
            this.selectableItem.value = this.selectableItemResult;
            this.onSelectableItemChanged.next([this.selectableItem]);
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
            this.selectableItemHtmlService.getSelectableItems(htmlContent, [this.selectableType], null,
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
            const cacheKey = id;

            const isCachedValueExist = !!cachedValues[cacheKey];
            if (isCachedValueExist) {
                const selectableItemData = new SelectableItem(id, selectableItemMetadata, cachedValues[cacheKey]);
                results.push(selectableItemData);
            }
            else {
                const promise = this._selectableListService
                    .getSelectableListValuesById(id)
                    .then(selectableItemValues => {
                        const defaultSelectableItemValue =
                            this.getDefaultSelectableItemValue(selectableItemValues);

                        const cacheKey = id;
                        cachedValues[cacheKey] = defaultSelectableItemValue;

                        const selectableItemData =
                            new SelectableItem(id, selectableItemMetadata, defaultSelectableItemValue);

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

    private initSelectableListService() {
        this._selectableListService = this.isLibrarySelectableList
            ? this.librarySelectableListService
            : this.selectableListService;
    }
}