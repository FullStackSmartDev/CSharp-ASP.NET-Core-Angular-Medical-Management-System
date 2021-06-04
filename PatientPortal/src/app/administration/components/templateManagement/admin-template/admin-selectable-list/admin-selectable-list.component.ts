import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { BaseSelectableListComponent } from 'src/app/share/classes/baseSelectableListComponent';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "admin-selectable-list",
    templateUrl: "./admin-selectable-list.component.html"
})
export class AdminSelectableListComponent extends BaseSelectableListComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string> = new EventEmitter();
    @Input("companyId") companyId: string;

    selectableListId: string = "";
    selectableListDataSource: any = {};

    constructor(selectableItemHtmlService: SelectableItemHtmlService,
        private selectableListService: SelectableListService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {

        super(selectableItemHtmlService);
        this.initSelectableListDataSource();
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    onSelectableListChanged($event) {
        const selectableListId = $event.value;
        if (!selectableListId)
            return;

        this.selectableListService.getByIdWithCatgeoryName(selectableListId)
            .then(selectableList => {
                const selectableItemHtmlElementString
                    = this.getHtmlElementString({
                        categoryName: selectableList.categoryName,
                        selectableItemName: selectableList.selectableListName
                    });

                this.onSelectableHtmlElementGenerated
                    .next(selectableItemHtmlElementString);

                this.selectableListId = "";
            })
            .catch(error => {
                this.selectableListId = "";
                this.alertService.error(error.message ? error.message : error)
            });
    }

    private initSelectableListDataSource(): any {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("selectablelist"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }
}