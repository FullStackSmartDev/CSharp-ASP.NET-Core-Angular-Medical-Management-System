import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { BaseSelectableListComponent } from 'src/app/share/classes/baseSelectableListComponent';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { SelectableItemService } from 'src/app/_services/selectable-item.service';
import { SelectableItemRequest } from 'src/app/_models/selectableItemRequest';
import { SelectableItemType } from 'src/app/_models/selectableItemType';

@Component({
    selector: "admin-selectable-list",
    templateUrl: "./admin-selectable-list.component.html"
})
export class AdminSelectableListComponent extends BaseSelectableListComponent implements IAdminSelectableComponent, OnInit {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string> = new EventEmitter();
    @Input("companyId") companyId: string;

    selectableListId: string = "";
    selectableListDataSource: any = {};

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private selectableItemService: SelectableItemService) {

        super();
    }

    get isLibrarySelectableList(): boolean {
        return !this.companyId;
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    ngOnInit() {
        this.initSelectableListDataSource();
    }

    onSelectableListChanged($event) {
        const selectableListId = $event.value;
        if (!selectableListId)
            return;

        const selectableItemRequest = new SelectableItemRequest();
        selectableItemRequest.selectableListId = selectableListId;
        selectableItemRequest.type = SelectableItemType.List;

        this.selectableItemService.getSelectableHtmlElementString(selectableItemRequest)
            .then((selectableItemHtmlElementString) => {
                this.onSelectableHtmlElementGenerated
                    .next(selectableItemHtmlElementString);

                this.selectableListId = "";
            })
            .catch(error => {
                this.selectableListId = "";
                this.alertService.error(error.message ? error.message : error)
            });
    }

    private initSelectableListDataSource() {
        if (!this.isLibrarySelectableList) {
            this.initCompanySelectableListDataSource(this.companyId);
            return;
        }

        this.initLibrarySelectableListDataSource();
    }

    private initCompanySelectableListDataSource(companyId: string) {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.selectableList),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initLibrarySelectableListDataSource() {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.librarySelectableList),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod(() => { }, this)
        });
    }
}