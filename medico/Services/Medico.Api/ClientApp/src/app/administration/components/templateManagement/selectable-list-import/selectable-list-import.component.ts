import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { SelectableList } from 'src/app/_models/selectableList';
import { LibrarySelectableListService } from 'src/app/administration/services/library/library-selectable-list.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { SelectableListSearchFilter } from 'src/app/administration/models/selectableListSearchFilter';

@Component({
    selector: "selectable-list-import",
    templateUrl: "./selectable-list-import.component.html"
})
export class SelectableListImportComponent implements OnInit {
    @Input() companyId: string;

    @Output() onSelectableListImportApplied: EventEmitter<void> =
        new EventEmitter<void>();

    @Output() onSelectableListImportCanceled: EventEmitter<void> =
        new EventEmitter<void>();

    categoryId: string = "";
    categoryDataSource: any = {};

    selectableLists: SelectableList[] = [];
    selectedLists: SelectableList[] = [];

    constructor(private librarySelectableListService: LibrarySelectableListService,
        private alertService: AlertService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngOnInit() {
        this.initCategoryDataSource();
    }

    onCategoryChanged($event) {
        const categoryId = $event.value;
        if (!categoryId)
            return;

        this.categoryId = categoryId;
        this.loadSelectableListsFromLibrary();
    }

    cancelListsImporting() {
        this.onSelectableListImportCanceled.next();
    }

    importLists() {
        if (!this.selectedLists.length) {
            this.alertService.warning("You haven't selected any templates");
            return;
        }

        const selectedListsIds = this.selectedLists
            .map(t => t.id);

        this.selectableListService.importLibrarySelectableLists(this.companyId,
            this.categoryId, selectedListsIds)
            .then(() => {
                this.onSelectableListImportApplied.next();
            });
    }

    private initCategoryDataSource() {
        this.categoryDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.librarySelectableListCategory),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private loadSelectableListsFromLibrary() {
        const templateSearchFilter = new SelectableListSearchFilter();
        templateSearchFilter.categoryId = this.categoryId;
        templateSearchFilter.companyId = this.companyId;
        templateSearchFilter.excludeImported = true;

        this.librarySelectableListService
            .getByFilter(templateSearchFilter)
            .then(selectableLists => {
                this.selectableLists = selectableLists;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}