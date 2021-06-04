import { Component, ViewChild, OnInit, OnDestroy, HostListener } from "@angular/core";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataGridComponent, DxFormComponent, DxPopupComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { AdminRichTextEditorComponent } from '../../../../share/components/admin-rich-text-editor/admin-rich-text-editor.component';
import { Template } from 'src/app/_models/template';
import { TemplateService } from 'src/app/_services/template.service';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { TemplateGridItem } from 'src/app/_models/templateGridItem';
import { SortableItem } from 'src/app/share/classes/sortableItem';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { CanDeleteResult } from 'src/app/_models/canDeleteResult';
import { PatientChartDocumentService } from 'src/app/_services/patient-chart-document.service';
import { Dependency } from 'src/app/_models/dependency';

@Component({
    selector: "admin-template",
    templateUrl: "./admin-template.component.html"
})
export class AdminTemplateComponent extends BaseAdminComponent implements OnDestroy, OnInit {
    @ViewChild("templatesGrid", { static: false }) templatesGrid: DxDataGridComponent;
    @ViewChild("templatePopup", { static: false }) templatePopup: DxPopupComponent;
    @ViewChild("templateForm", { static: false }) templateForm: DxFormComponent;

    @ViewChild("templateTypeSelectBox", { static: false }) templateTypeSelectBox: DxSelectBoxComponent;

    @ViewChild("detailedRichTextEditor", { static: false }) detailedRichTextEditor: AdminRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor", { static: false }) defaultRichTextEditor: AdminRichTextEditorComponent;

    companyIdSubscription: Subscription;
    companyId: string;

    _isDefaultTemplateEnabled: boolean = false;

    get isDefaultTemplateEnabled(): boolean {
        return this._isDefaultTemplateEnabled;
    }

    set isDefaultTemplateEnabled(value: boolean) {
        if (!value) {
            this.template.defaultTemplateHtml = "";
        }

        this._isDefaultTemplateEnabled = value;
    }

    templatesToReorder: SortableItem[] = [];

    isTemplateOrderFormVisible: boolean = false;

    isTemplateImportFormVisible: boolean = false;

    selectedTemplateTypeId: string = "";
    templateTypeDataSource: any = {};

    detailedTemplateEditorVisible: boolean = false;

    templateId: string = "";
    template: Template;
    selectedTemplates: Array<Template>;

    templateDataSource: any = {};

    isTemplateFormVisible: boolean = false;
    isNewTemplate: boolean;

    isDetailedTemplatePreviewVisible: boolean = false;

    constructor(private dxDataUrlService: DxDataUrlService,
        private templateTypeService: TemplateTypeService,
        private alertService: AlertService,
        private templateService: TemplateService,
        private devextremeAuthService: DevextremeAuthService,
        private companyIdService: CompanyIdService,
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

    syncWithLibraryTemplate(template, $event) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to sync template ?", "Confirm sync");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateService.syncWithLibraryTemplate(template.id, template.version)
                    .then(() => {
                        this.alertService.info("The template was successfully synchronized");
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    onTemplatesImportApplied() {
        if (this.templatesGrid)
            this.templatesGrid.instance.getDataSource().reload();

        this.templateTypeSelectBox.instance
            .getDataSource().reload();

        this.isTemplateImportFormVisible = false;
    }

    onTemplatesImportCanceled() {
        this.isTemplateImportFormVisible = false;
    }

    deactivateTemplate(template, $event) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to deactivate template ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateService.activateDeactivateTemplate(template.id, false)
                    .then(() => {
                        this.templatesGrid.instance
                            .getDataSource().reload();
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    activateTemplate(template, $event) {
        $event.stopPropagation();
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to activate template ?", "Confirm activation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.templateService.activateDeactivateTemplate(template.id, true)
                    .then(() => {
                        this.templatesGrid.instance
                            .getDataSource().reload();
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    //M185: "Templates" page becomes broken after resizing the page
    //every time when we resize browser window we have to initialize template creation form again if it is opened
    @HostListener('window:resize', ['$event'])
    onResize() {
        if (this.isTemplateFormVisible) {
            this.isTemplateFormVisible = false;
            setTimeout(() => this.isTemplateFormVisible = true, 0);
        }
    }

    openTemplateImportManagementPopup() {
        this.isTemplateImportFormVisible = true;
    }

    openTemplateOrderManagementPopup() {
        this.isTemplateOrderFormVisible = true;
    }

    onTemplateChanged($event) {
        const template = $event.selectedRowKeys[0];
        if (!template)
            return;

        const templateId = template.id
        if (!templateId)
            return;

        this.templateService.getById(templateId)
            .then(template => {
                this.template = template;
                this.isNewTemplate = false;

                if (this.template.defaultTemplateHtml) {
                    this.isDefaultTemplateEnabled = true;
                }

                this.isTemplateFormVisible = true;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    onTemplatesOrderChanged($event: SortableItem[]) {
        this.templateService
            .reorderTemplates($event)
            .then(() => this.templatesGrid.instance
                .getDataSource().reload())
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    insertHtmlElementIntoRTXEditor($event: string) {
        this.detailedRichTextEditor.insertContent($event);
    }

    onSelectableItemValueGenerated($event) {
        this.detailedRichTextEditor.insertContent($event);
    }

    showDetailedTemplatePreview() {
        this.isDetailedTemplatePreviewVisible = true;
    }

    saveTemplate() {
        const validationResult = this.validateTemplate();

        if (!validationResult.success) {
            this.alertService.alert(validationResult.message, validationResult.title);
            return;
        }

        if (this.isNewTemplate)
            this.template.companyId = this.companyId;

        this.templateService
            .save(this.template)
            .then(() => {
                this.resetTemplateForm();
                this.isTemplateFormVisible = false;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    switchToTemplateForm() {
        this.isNewTemplate = true;
        this.isTemplateFormVisible = true;
    }

    switchToTemplatesDataGrid() {
        this.resetTemplateForm();
        this.isTemplateFormVisible = false;
    }

    onDetailedTemplatePreviewHidden() {
        this.isDetailedTemplatePreviewVisible = false;
    }

    deleteTemplate(template: Template, $event: any) {
        $event.stopPropagation();

        this.canDeleteTemplate(template.id, template.companyId)
            .then(canDeleteResult => {
                const canDelete = canDeleteResult.canDelete;
                if (!canDelete) {
                    const warnMessage =
                        `The template <b>${template.title}</b> can not be deleted. It is used in <b>${canDeleteResult.dependencies.map((d) => d.title).join(", ")}</b>`;
                    this.alertService.warning(warnMessage);
                    return;
                }

                const confirmationPopup = this.alertService
                    .confirm("Are you sure you want to delete the template ?", "Confirm deletion");

                confirmationPopup.then(dialogResult => {
                    if (dialogResult) {
                        this.templateService.delete(template.id)
                            .then(() => this.templatesGrid.instance.refresh())
                            .catch((error) => this.alertService.error(error.message ? error.message : error));
                    }
                });
            });
    }

    onTemplateTypeChanged($event): void {
        const templateTypeId = $event.value;
        if (!templateTypeId)
            return;

        this.templateTypeService.getById(templateTypeId)
            .then(templateType => {
                this.template.templateTypeId = templateType.id;
                this.selectedTemplateTypeId = templateType.id;

                if (this.templatesGrid) {
                    this.templatesGrid.instance.refresh();
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    private canDeleteTemplate(templateId: string, companyId: string): Promise<CanDeleteResult> {
        return this.patientChartDocumentService
            .getByTemplateUse(templateId, companyId)
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

    private init() {
        this.template = new Template();
        this.isNewTemplate = true;

        this.initlibraryTemplateTypeDataSource();
        this.initTemplateDataSource();
    }

    private initlibraryTemplateTypeDataSource() {
        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.templateTypes),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initTemplateDataSource() {
        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.templates),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.templateTypeId = this.selectedTemplateTypeId;
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });

        this.templateDataSource.store.on("loaded", (templates) => {
            this.setNextTemplateOrder(templates);
            this.setTemplatesToReorder(templates);
        });
    }

    private setTemplatesToReorder(templates: TemplateGridItem[]) {
        if (!templates.length)
            return

        this.templatesToReorder = templates
            .filter(t => t.templateOrder)
            .map(t => SortableItem.createSortableItem(t.id, t.templateOrder, t.reportTitle));
    }

    private setNextTemplateOrder(templates: Template[]) {
        const templatesLength = templates.length;
        if (!templatesLength) {
            this.template.templateOrder = 1;
            return;
        }

        var templatesOrders = templates
            .filter(t => t.templateOrder)
            .map(t => t.templateOrder);

        if (!templatesOrders.length) {
            this.template.templateOrder = 1;
            return;
        }

        this.template.templateOrder = Math.max(...templatesOrders) + 1
    }

    private resetTemplateForm() {
        this.templateId = "";
        this.template = new Template();
        this.template.templateTypeId = this.selectedTemplateTypeId;

        this.isDefaultTemplateEnabled = false;
        this.detailedTemplateEditorVisible = false;
        this.selectedTemplates = [];
        this.isNewTemplate = true;
    }

    private validateTemplate(): any {
        const validationResult = this.templateForm
            .instance.validate();

        this.template.detailedTemplateHtml = this.detailedRichTextEditor.content;

        if (this.isDefaultTemplateEnabled) {
            this.template.defaultTemplateHtml = this.defaultRichTextEditor.content;
        }

        if (!validationResult.isValid) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "Navigate to the 'Base Info' tab"
            };
        }

        if (!this.template.detailedTemplateHtml) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "The detailed template content is required"
            };
        }

        if (this.isDefaultTemplateEnabled && !this.template.defaultTemplateHtml) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "The default template content is required"
            };
        }

        return {
            success: true,
            title: "",
            message: ""
        };
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;

                    this.selectedTemplateTypeId = "";

                    if (this.templateTypeSelectBox && this.templateTypeSelectBox.instance) {
                        this.templateTypeSelectBox.instance
                            .getDataSource().reload();
                    }
                }
            });
    }
}