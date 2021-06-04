import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { ReferenceTableListComponent } from 'src/app/share/components/reference-table-list/reference-table-list.component';
import { LibraryExpressionService } from 'src/app/_services/library-expression.service';
import { LibraryTemplateService } from 'src/app/administration/services/library/library-template.service';
import { CreateUpdateExpressionModel } from 'src/app/_models/createUpdateExpressionModel';
import { ExpressionModel } from 'src/app/_models/expressionModel';

@Component({
    selector: "library-expressions-builder",
    templateUrl: "library-expressions-builder.component.html",
})
export class LibraryExpressionsBuilderComponent extends BaseAdminComponent {
    @ViewChild("expressionsGrid", { static: false }) expressionsGrid: DxDataGridComponent;
    @ViewChild("expressionForm", { static: false }) expressionForm: DxFormComponent;
    @ViewChild("referenceTableList", { static: false }) referenceTableList: ReferenceTableListComponent;

    expression: CreateUpdateExpressionModel;
    selectedExpressions: any[];

    expressionDataSource: any = {};

    isExpressionFormVisible: boolean = false;
    isNewExpression: boolean;

    constructor(private dxDataUrlService: DxDataUrlService,
        private alertService: AlertService,
        private libraryExpressionService: LibraryExpressionService,
        private devextremeAuthService: DevextremeAuthService,
        private libraryTemplateService: LibraryTemplateService) {

        super();

        this.init();
    }

    onExpressionChanged($event) {
        const expression = $event.selectedRowKeys[0];
        if (!expression)
            return;

        const expressionId = expression.id
        if (!expressionId)
            return;

        this.libraryExpressionService.getById(expressionId)
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

        const referenceTables = this.referenceTableList.expressionReferenceTables;
        if (referenceTables && referenceTables.length) {
            this.expression.referenceTables = referenceTables
                .map(t => t.id);
        }

        this.libraryExpressionService
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
                        this.libraryExpressionService.delete(expression.id)
                            .then(() => {
                                this.expressionsGrid
                                    .instance.getDataSource().reload();
                            })
                            .catch((error) => this.alertService.error(error.message ? error.message : error));
                    }
                });
            });
    }

    private canDeleteExpression(expressionId: string): Promise<boolean> {
        return this.libraryTemplateService
            .getFirstByExpressionId(expressionId)
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
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.libraryExpressions),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private resetExpressionForm() {
        this.expression = new CreateUpdateExpressionModel();
        this.initExpressionDataSource();
    }
}