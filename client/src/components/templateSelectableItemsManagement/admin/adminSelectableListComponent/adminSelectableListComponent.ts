import { Output, EventEmitter, Component } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastService } from '../../../../provider/toastService';
import { BaseSelectableListComponent } from '../../base/baseSelectableListComponent';
import { SelectableItemHtmlService } from '../../../../provider/selectableItemHtmlService';
import { DataService } from '../../../../provider/dataService';
import { BaseSelectableComponent } from '../../base/baseSelectableComponent';
import { TemplateLookupItemDataService } from '../../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ApplicationConfigurationService } from '../../../../provider/applicationConfigurationService';

@Component({
    templateUrl: 'adminSelectableListComponent.html',
    selector: 'admin-selectable-list'
})

export class AdminSelectableListComponent extends BaseSelectableListComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    selectedLookupItemId: string = "";
    lookupItemDataSource: any = {};

    constructor(
        private toastService: ToastService,
        private dataService: DataService,
        selectableItemHtmlService: SelectableItemHtmlService,
        private templateLookupItemDataService: TemplateLookupItemDataService) {

        super(selectableItemHtmlService);
        this.initLookupItemDataSource();
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    onTemplateLookupItemChanged($event) {
        const templateLookupItemId = $event.value;
        const self = this;
        if (!templateLookupItemId)
            return;
        this.dataService.getTemplateLookupItemWithCategoryName(templateLookupItemId)
            .then(templteLookupItem => {

                const selectableItemHtmlElementString
                    = self.getHtmlElementString({
                        categoryName: templteLookupItem.CategoryName,
                        selectableItemName: templteLookupItem.Name
                    });

                self.onSelectableHtmlElementGenerated
                    .next(selectableItemHtmlElementString);
                self.selectedLookupItemId = "";
            })
            .catch(error => {
                self.selectedLookupItemId = "";
                self.toastService
                    .showErrorMessage(error.message ? error.message : error);
            });
    }

    private initLookupItemDataSource(): any {
        this.lookupItemDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.templateLookupItemDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["Id", "Title"];
                const isActiveFilter = ["IsActive", "=", true];

                const takeItemCount = ApplicationConfigurationService
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [isActiveFilter, "and", [searchExpr, searchOperation, searchValue]];
                }
                else {
                    loadOptions.filter = isActiveFilter;
                }

                return this.templateLookupItemDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }
}

export class IAdminSelectableComponent {
    selectableComponent: BaseSelectableComponent
}