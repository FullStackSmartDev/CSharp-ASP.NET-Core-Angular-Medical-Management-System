import { Component, Input, OnInit, Injector, ViewChild } from '@angular/core';
import { LookupModel } from 'src/app/_models/lookupModel';
import { BaseExpressionService } from 'src/app/_services/base-expression.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { LibraryExpressionService } from 'src/app/_services/library-expression.service';
import { ExpressionService } from 'src/app/_services/expression.service';

@Component({
    selector: 'reference-table-list',
    templateUrl: './reference-table-list.component.html'
})

export class ReferenceTableListComponent implements OnInit {
    @ViewChild("referenceTableSelectBox", { static: true }) referenceTableSelectBox: DxSelectBoxComponent

    @Input() companyId: string;
    @Input() expressionId: string;

    expressionReferenceTables: LookupModel[] = [];

    referenceTableDataSource: any = {};

    private expressionService: BaseExpressionService;

    constructor(private injector: Injector,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    get isLibraryReferenceTableList(): boolean {
        return !this.companyId;
    }

    ngOnInit(): void {
        this.initExpressionService(this.isLibraryReferenceTableList, this.injector);
        this.initExpressionReferenceTables();

        this.initReferenceTablesDataSource();
    }

    onReferenceTableSelected($event) {
        const referenceTableId = $event.value;
        if (!referenceTableId)
            return;

        const isReferenceTableAlreadyAdded =
            !!this.expressionReferenceTables.find(t => t.id === referenceTableId);

        if (isReferenceTableAlreadyAdded) {
            this.referenceTableSelectBox.instance.reset();
            return;
        }

        const referenceTableLabel =
            this.referenceTableSelectBox.text;

        const referenceTable = new LookupModel();
        referenceTable.id = referenceTableId;
        referenceTable.name = referenceTableLabel;

        this.expressionReferenceTables.push(referenceTable);
        this.referenceTableSelectBox.instance.reset();
    }

    private initExpressionService(isLibraryReferenceTableList: boolean, injector: Injector) {
        this.expressionService =
            injector.get(isLibraryReferenceTableList ? LibraryExpressionService : ExpressionService);
    }

    private initExpressionReferenceTables() {
        if (!this.expressionId)
            return;

        this.expressionService.getExpressionReferenceTables(this.expressionId)
            .then(referenceTables => this.expressionReferenceTables = referenceTables);
    }

    private initReferenceTablesDataSource() {
        this.referenceTableDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.referenceTables),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    if (!this.isLibraryReferenceTableList)
                        jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }
}