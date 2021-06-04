import { Component, ViewChild, OnDestroy, OnInit } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { TemplateType } from 'src/app/_models/templateType';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { TemplateService } from 'src/app/_services/template.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { CanDeleteResult } from 'src/app/_models/canDeleteResult';
import { Dependency } from 'src/app/_models/dependency';
import { PatientChartDocumentService } from 'src/app/_services/patient-chart-document.service';

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
        private devextremeAuthService: DevextremeAuthService,
        private patientChartDocumentService: PatientChartDocumentService) {

        super();

        this.init();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    deactivateTemplateType(templateType: TemplateType, $event) {
        $event.stopPropagation();

        const templateTypeId = templateType.id;
        this.canDeactivateTemplateType(templateType.id, templateType.companyId)
            .then(canDeactivate => {
                if (!canDeactivate) {
                    this.alertService.warning("Template Type already is used. You cannot deactivate it.");
                    return;
                }

                this.continueDeactivatingTemplateType(templateTypeId);
            });
    }

    activateTemplateType(templateType: TemplateType, $event) {
        $event.stopPropagation();
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to activate the template type ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateTypeService.activateDeactivateTemplateType(templateType.id, true)
                    .then(() => {
                        this.templateTypeDataGrid.instance
                            .refresh();
                    });
            }
        });
    }

    deleteTemplateType(templateType: TemplateType, $event: any) {
        $event.stopPropagation();

        const templateTypeId = templateType.id;

        this.canDeleteTemplateType(templateTypeId, templateType.companyId)
            .then(warningMessage => {
                const canDeleteTemplateType = !warningMessage;
                if (canDeleteTemplateType) {
                    this.continueDeletingTemplateType(templateTypeId);
                    return;
                }

                this.alertService.warning(`The template type <b>${templateType.title}</b> can not be deleted. ${warningMessage}`)
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

    validateTitleExistence = (params) => {
        const templteTypeTitle = params.value;
        const templateTypeGeneratedName = this.entityNameService
            .formatFromReadableEntityName(templteTypeTitle);

        this.templateTypeService.getByName(templateTypeGeneratedName, this.companyId)
            .then(templateType => {
                const isTemplateTypeTitleValid = !templateType || this.templateType.id === templateType.id

                //the template type name will be generated only one time during type creation; 
                //the rest title update operations do not affect to name - the template type name has to be unique;
                //it is used in patient chart tree to find appropriate template list section and adding templates
                if (isTemplateTypeTitleValid && this.isNewTemplateType) {
                    this.templateType.name = templateTypeGeneratedName;
                }

                params.rule.isValid = isTemplateTypeTitleValid;
                params.rule.message = `Template type with title '${templteTypeTitle}' already exists`;

                params.validator.validate();
            })

        return false;
    }

    private createUpdateTemplateTypeInternally() {
        const validationResult = this.templateTypeForm
            .instance
            .validate();

        if (!validationResult.isValid)
            return;

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
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.templateTypes),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private continueDeactivatingTemplateType(templateTypeId: string) {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to deactivate the template type ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateTypeService.activateDeactivateTemplateType(templateTypeId, false)
                    .then(() => {
                        this.templateTypeDataGrid.instance
                            .refresh();
                    });
            }
        });
    }

    private continueDeletingTemplateType(templateTypeId: string) {
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

    private canDeleteTemplateType(templateTypeId: string, companyId: string): Promise<string> {
        return Promise.all([
            this.isTemplateTypeUsedInPatientChartDocuments(templateTypeId, companyId),
            this.doesTemplateTypeHaveTemplates(templateTypeId, companyId)
        ])
            .then(result => {
                const canDeleteForPatientChartDocuments = result[0];
                const canDeleteForTemplates = result[1];

                const canDelete = canDeleteForTemplates.canDelete
                    && canDeleteForPatientChartDocuments.canDelete;

                if (canDelete)
                    return "";

                let warningMessage = "It is used in ";
                if (!canDeleteForTemplates.canDelete)
                    warningMessage += `<b>${canDeleteForTemplates.dependencies
                        .map(d => d.title)
                        .join(", ")}</b>`;

                if (!canDeleteForPatientChartDocuments.canDelete) {
                    const patientChartDependenciesStr = canDeleteForPatientChartDocuments.dependencies
                        .map(d => d.title)
                        .join(", ");

                    const patientChartDependenciesWarning = `<b>${patientChartDependenciesStr}</b>`

                    warningMessage += !canDeleteForTemplates.canDelete
                        ? `, ${patientChartDependenciesWarning}`
                        : patientChartDependenciesWarning;
                }

                return warningMessage;
            });
    }

    private isTemplateTypeUsedInPatientChartDocuments(templateTypeId: string, companyId: string): Promise<CanDeleteResult> {
        return this.patientChartDocumentService
            .getByTemplateTypeUse(templateTypeId, companyId)
            .then(patientChartDocuments => {
                if (!patientChartDocuments.length)
                    return CanDeleteResult.successResult();

                const dependencies = patientChartDocuments.reduce((dependencies, patientChartDocument) => {
                    const dependency = Dependency.create("Patient Chart", patientChartDocument.name);
                    dependencies.push(dependency);
                    return dependencies;
                }, []);

                return CanDeleteResult.failedResult(dependencies);
            })
    }

    private doesTemplateTypeHaveTemplates(templateTypeId: string, companyId: string): Promise<CanDeleteResult> {
        return this.templateService.getFirstByTemplateTypeId(templateTypeId, companyId)
            .then(template => {
                const canDeleteTemplateType = !template;
                if (canDeleteTemplateType)
                    return CanDeleteResult.successResult();

                const dependencies = [
                    Dependency.create("Template", template.reportTitle)
                ];

                return CanDeleteResult.failedResult(dependencies);
            });
    }

    private canDeactivateTemplateType(templateTypeId: string, companyId: string): Promise<boolean> {
        return this.templateService.getFirstActiveByTemplateTypeId(templateTypeId, companyId)
            .then(template => {
                return !template;
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