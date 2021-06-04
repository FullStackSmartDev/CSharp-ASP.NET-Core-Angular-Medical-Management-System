import { Component, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { TemplateType } from 'src/app/_models/templateType';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { LibraryTemplateTypeService } from 'src/app/administration/services/library/library-template-type.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { LibraryTemplateService } from 'src/app/administration/services/library/library-template.service';
import { LibraryPatientChartDocumentService } from 'src/app/_services/library-patient-chart-document.service';
import { CanDeleteResult } from 'src/app/_models/canDeleteResult';
import { Dependency } from 'src/app/_models/dependency';

@Component({
    selector: "library-template-type",
    templateUrl: "library-template-type.component.html",
})

export class LibraryTemplateTypeComponent extends BaseAdminComponent {
    @ViewChild("templateTypeDataGrid", { static: false }) templateTypeDataGrid: DxDataGridComponent;
    @ViewChild("templateTypePopup", { static: false }) templateTypePopup: DxPopupComponent;
    @ViewChild("templateTypeForm", { static: false }) templateTypeForm: DxFormComponent;

    selectedTemplateTypes: Array<any> = [];
    templateType: TemplateType;
    isNewTemplateType: boolean = true;

    templateTypeDataSource: any = {};

    isTemplateTypePopupOpened: boolean = false;

    constructor(private dxDataUrlService: DxDataUrlService,
        private libraryTemplateTypeService: LibraryTemplateTypeService,
        private alertService: AlertService,
        private libraryTemplateService: LibraryTemplateService,
        private devextremeAuthService: DevextremeAuthService,
        private entityNameService: EntityNameService,
        private libraryPatientChartDocumentService: LibraryPatientChartDocumentService) {

        super();

        this.init();
    }

    deactivateTemplateType(templateType: TemplateType, $event) {
        $event.stopPropagation();
        const templateTypeId = templateType.id;
        this.canDeactivateTemplateType(templateType.id)
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
                this.libraryTemplateTypeService.activateDeactivateTemplateType(templateType.id, true)
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

        this.canDeleteTemplateType(templateTypeId)
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
        const validationResult = this.templateTypeForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewTemplateType) {
            this.templateType.isActive = true;
            this.templateType.isPredefined = false;
        }

        this.libraryTemplateTypeService.save(this.templateType)
            .then(() => {
                this.templateTypeDataGrid.instance.refresh();

                this.resetTemplateTypeForm();
                this.isTemplateTypePopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onTemplateTypeSelected($event) {
        const selectedTemplateType = $event.selectedRowsData[0];
        if (!selectedTemplateType)
            return;

        const selectedTemplateTypeId = $event.selectedRowsData[0].id;
        this.libraryTemplateTypeService
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

        this.libraryTemplateTypeService.getByName(templateTypeGeneratedName)
            .then(templateType => {
                const isTemplateTypeTitleValid = !templateType || this.templateType.id === templateType.id;

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
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.libraryTemplateTypes),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private continueDeactivatingTemplateType(templateTypeId: string) {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to deactivate the template type ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.libraryTemplateTypeService.activateDeactivateTemplateType(templateTypeId, false)
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
                this.libraryTemplateTypeService.delete(templateTypeId)
                    .then(() => {
                        this.templateTypeDataGrid.instance.refresh();
                    });
            }
        });
    }

    private canDeactivateTemplateType(libraryTemplateTypeId: string): Promise<boolean> {
        return this.libraryTemplateService.getFirstActiveByTemplateTypeId(libraryTemplateTypeId)
            .then(template => {
                return !template;
            });
    }

    private canDeleteTemplateType(templateTypeId: string): Promise<string> {
        return Promise.all([
            this.isTemplateTypeUsedInPatientChartDocuments(templateTypeId),
            this.doesTemplateTypeHaveTemplates(templateTypeId)
        ])
            .then(result => {
                const canDeleteForTemplates = result[0];
                const canDeleteForPatientChartDocuments = result[1];

                const canDelete = canDeleteForTemplates.canDelete
                    && canDeleteForPatientChartDocuments.canDelete;

                if (canDelete)
                    return "";

                let warningMessage = "It is used in ";
                if (!canDeleteForTemplates.canDelete)
                    warningMessage += `<b>${canDeleteForTemplates.dependencies
                        .map(d => d.title)
                        .join(", ")}</b>`;

                if (!canDeleteForPatientChartDocuments.canDelete)
                    warningMessage += `<b>${canDeleteForPatientChartDocuments.dependencies
                        .map(d => d.title)
                        .join(", ")}</b>`;

                return warningMessage;
            });
    }

    private isTemplateTypeUsedInPatientChartDocuments(templateTypeId: string): Promise<CanDeleteResult> {
        return this.libraryPatientChartDocumentService
            .getByTemplateTypeUse(templateTypeId)
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

    private doesTemplateTypeHaveTemplates(templateTypeId: string): Promise<CanDeleteResult> {
        return this.libraryTemplateService.getFirstByTemplateTypeId(templateTypeId)
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
}