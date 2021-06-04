import { Component, ViewChild, OnDestroy, OnInit } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { TemplateType } from 'src/app/administration/models/templateType';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { TemplateService } from 'src/app/_services/template.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "template-type",
    templateUrl: "./template-type.component.html"
})
export class TemplateTypeComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("templateTypeDataGrid", { static: false }) templateTypeDataGrid: DxDataGridComponent;
    @ViewChild("templateTypePopup", { static: false }) templateTypePopup: DxPopupComponent;
    @ViewChild("templateTypeForm", { static: false }) templateTypeForm: DxFormComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    selectedTemplateTypes: Array<any> = [];
    templateType: TemplateType;
    isNewTemplateType: boolean = true;

    templateTypeDataSource: any = {};

    isTemplateTypePopupOpened: boolean = false;

    constructor(private entityNameService: EntityNameService,
        private dxDataUrlService: DxDataUrlService,
        private templateTypeService: TemplateTypeService,
        private alertService: AlertService,
        private templateService: TemplateService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService) {

        super();

        this.init();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    onTemplateTypeFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewTemplateType && dataField === "isActive" && !$event.value) {

            const templateTypeId = this.templateType.id;
            this.canDeactivateDeleteTemplateType(templateTypeId, false)
                .then(canDeactivate => {

                    if (!canDeactivate) {
                        this.templateType.isActive = true;
                        this.alertService.warning("Template type is already used. You cannot deactivate it.");
                    }
                });
        }
    }

    deleteTemplateType(templateType: any, $event: any) {
        $event.stopPropagation();

        const categoryId = templateType.id;

        this.canDeactivateDeleteTemplateType(categoryId, true)
            .then(canDelete => {
                if (!canDelete) {
                    this.alertService.warning("Template Type already is used. You cannot delete it.");
                    return;
                }

                this.continueDeletingTemplateType(categoryId);
            });
    }

    openTemplateTypeForm() {
        this.isTemplateTypePopupOpened = true;
    }

    onTemplateTypePopupHidden() {
        this.resetTemplateTypeForm();
    }

    createUpdateTemplateType() {
        this.createUpdateTemplateTypeInternally();
    }

    onTemplateTypeSelected($event) {
        const selectedTemplateType = $event.selectedRowsData[0];
        if (!selectedTemplateType)
            return;

        const selectedTemplateTypeId = $event.selectedRowsData[0].id;
        this.templateTypeService
            .getById(selectedTemplateTypeId)
            .then((templateType) => {
                this.templateType = templateType;
                this.isTemplateTypePopupOpened = true;
                this.isNewTemplateType = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.templateTypeService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.templateType.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    private createUpdateTemplateTypeInternally() {
        const validationResult = this.templateTypeForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewTemplateType) {
            this.templateType.companyId = this.companyId;
        }

        this.templateTypeService.save(this.templateType)
            .then(() => {
                this.templateTypeDataGrid.instance.refresh();

                this.resetTemplateTypeForm();
                this.isTemplateTypePopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private resetTemplateTypeForm() {
        this.isNewTemplateType = true;
        this.templateType = new TemplateType();
        this.selectedTemplateTypes = [];
    }

    private init(): any {
        this.templateType = new TemplateType();
        this.initTemplateTypeDataSource();
    }

    private initTemplateTypeDataSource(): any {
        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("templatetype"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private continueDeletingTemplateType(templateTypeId: string): void {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the template type ? All related templates will be deleted too.", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateTypeService.delete(templateTypeId)
                    .then(() => {
                        this.templateTypeDataGrid.instance.refresh();
                    });
            }
        });
    }

    private canDeactivateDeleteTemplateType(templateTypeId: string, isDeleteAction: boolean): Promise<boolean> {
        return this.templateService.getByTemplateTypeId(templateTypeId)
            .then(templates => {
                return isDeleteAction
                    ? !templates.length
                    : !templates.filter(t => t.isActive).length;
            });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.templateTypeDataGrid && this.templateTypeDataGrid.instance)
                        this.templateTypeDataGrid.instance.refresh();
                }
            });
    }
}