import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ReferenceTableListComponent } from 'src/app/share/components/reference-table-list/reference-table-list.component';
import { CreateUpdateExpressionModel } from 'src/app/_models/createUpdateExpressionModel';
import { TemplateService } from 'src/app/_services/template.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ExpressionService } from 'src/app/_services/expression.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ExpressionGridItemModel } from 'src/app/_models/expressionGridItemModel';
import { ExpressionModel } from 'src/app/_models/expressionModel';

@Component({
    selector: "expressions-builder",
    templateUrl: "expressions-builder.component.html",
})
export class ExpressionsBuilderComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("expressionsGrid", { static: false }) expressionsGrid: DxDataGridComponent;
    @ViewChild("expressionForm", { static: false }) expressionForm: DxFormComponent;
    @ViewChild("referenceTableList", { static: false }) referenceTableList: ReferenceTableListComponent;

    isExpressionImportFormVisible: boolean = false;

    isExecutionResultVisible: boolean = false;
    isExecutionContextVisible: boolean = false;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    expression: CreateUpdateExpressionModel;
    selectedExpressions: any[];

    expressionDataSource: any = {};

    isExpressionFormVisible: boolean = false;
    isNewExpression: boolean;

    constructor(private companyIdService: CompanyIdService,
        private dxDataUrlService: DxDataUrlService,
        private alertService: AlertService,
        private expressionService: ExpressionService,
        private devextremeAuthService: DevextremeAuthService,
        private templateService: TemplateService) {
        super();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.init();
        this.subscribeToCompanyIdChanges();
    }

    get isExecutionResultContextPopupVisible(): boolean {
        return this.isExecutionResultVisible || this.isExecutionContextVisible;
    }

    executeExpression() {
        this.isExecutionResultVisible = true;
    }

    getExecutionContext() {
        this.isExecutionContextVisible = true;
    }

    onExecutionContextResultPopupHidden() {
        this.isExecutionResultVisible = false;
        this.isExecutionContextVisible = false;
    }

    onReferenceTableImportApplied() {
        this.expressionsGrid.instance
            .getDataSource().reload();

        this.isExpressionImportFormVisible = false;
    }

    onReferenceTableImportCanceled() {
        this.isExpressionImportFormVisible = false;
    }

    syncWithLibraryExpression(expression: ExpressionGridItemModel, $event: any) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to sync expression ?", "Confirm sync");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.expressionService.syncWithLibraryReferenceTable(expression.id, expression.version)
                    .then(() => {
                        this.alertService.info("The expression was successfully synchronized");
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    onExpressionChanged($event) {
        const expression = $event.selectedRowKeys[0];
        if (!expression)
            return;

        const expressionId = expression.id
        if (!expressionId)
            return;

        this.expressionService.getById(expressionId)
            .then(expression => {
                this.expression = ExpressionModel.convertToCreateUpdateExpressionModel(expression);
                this.isNewExpression = false;
                this.isExpressionFormVisible = true;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    saveExpression() {
        const validationResult = this.expressionForm
            .instance
            .validate();

        if (!validationResult.isValid)
            return;

        if (this.isNewExpression)
            this.expression.companyId = this.companyId;

        const referenceTables = this.referenceTableList.expressionReferenceTables;
        if (referenceTables && referenceTables.length) {
            this.expression.referenceTables = referenceTables
                .map(t => t.id);
        }

        this.expressionService
            .save(this.expression)
            .then(() => {
                this.resetExpressionForm();
                this.isExpressionFormVisible = false;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    switchToExpressionForm() {
        this.isNewExpression = true;
        this.isExpressionFormVisible = true;
    }

    switchToExpressionsDataGrid() {
        this.resetExpressionForm();
        this.isExpressionFormVisible = false;
    }

    deleteExpression(expression: any, $event: any) {
        $event.stopPropagation();

        this.canDeleteExpression(expression.id)
            .then(canDelete => {
                if (!canDelete) {
                    const warnMessage =
                        `The expression <b>${expression.title}</b> can not be deleted. It is used in templates`;
                    this.alertService.warning(warnMessage);
                    return;
                }

                const confirmationPopup = this.alertService
                    .confirm("Are you sure you want to delete the expression ?", "Confirm deletion");

                confirmationPopup.then(dialogResult => {
                    if (dialogResult) {
                        this.expressionService.delete(expression.id)
                            .then(() => {
                                this.expressionsGrid
                                    .instance.getDataSource().reload();
                            })
                            .catch((error) => this.alertService.error(error.message ? error.message : error));
                    }
                });
            });
    }

    openExpressionImportManagementPopup() {
        this.isExpressionImportFormVisible = true;
    }

    private canDeleteExpression(expressionId: string): Promise<boolean> {
        return this.templateService
            .getFirstByExpressionId(expressionId, this.companyId)
            .then(template => {
                return !template;
            });
    }

    private init() {
        this.expression = new CreateUpdateExpressionModel();
        this.isNewExpression = true;

        this.initExpressionDataSource();
    }

    private initExpressionDataSource() {
        this.expressionDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.expressions),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.expressionsGrid && this.expressionsGrid.instance)
                        this.expressionsGrid.instance.refresh();
                }
            });
    }

    private resetExpressionForm() {
        this.expression = new CreateUpdateExpressionModel();
        this.initExpressionDataSource();
    }
}