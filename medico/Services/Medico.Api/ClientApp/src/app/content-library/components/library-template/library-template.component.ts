import { Component, ViewChild, HostListener } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { AdminRichTextEditorComponent } from 'src/app/share/components/admin-rich-text-editor/admin-rich-text-editor.component';
import { Template } from 'src/app/_models/template';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { LibraryTemplateTypeService } from 'src/app/administration/services/library/library-template-type.service';
import { LibraryTemplateService } from 'src/app/administration/services/library/library-template.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { TemplateGridItem } from 'src/app/_models/templateGridItem';
import { SortableItem } from 'src/app/share/classes/sortableItem';
import { LibraryPatientChartDocumentService } from 'src/app/_services/library-patient-chart-document.service';
import { CanDeleteResult } from 'src/app/_models/canDeleteResult';
import { Dependency } from 'src/app/_models/dependency';

@Component({
    selector: "library-template",
    templateUrl: "library-template.component.html",
})
export class LibraryTemplateComponent extends BaseAdminComponent {
    @ViewChild("templatesGrid", { static: false }) templatesGrid: DxDataGridComponent;
    @ViewChild("templatePopup", { static: false }) templatePopup: DxPopupComponent;
    @ViewChild("templateForm", { static: false }) templateForm: DxFormComponent;

    @ViewChild("libraryTemplateTypeSelectBox", { static: false }) libraryTemplateTypeSelectBox: DxSelectBoxComponent;

    @ViewChild("detailedRichTextEditor", { static: false }) detailedRichTextEditor: AdminRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor", { static: false }) defaultRichTextEditor: AdminRichTextEditorComponent;

    private _isDefaultTemplateEnabled: boolean = false;

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

    selectedlibraryTemplateTypeId: string = "";
    libraryTemplateTypeDataSource: any = {};

    detailedTemplateEditorVisible: boolean = false;

    templateId: string = "";
    template: Template;
    selectedTemplates: Array<Template>;

    templateDataSource: any = {};

    isTemplateFormVisible: boolean = false;
    isNewTemplate: boolean;

    isDetailedTemplatePreviewVisible: boolean = false;

    constructor(private dxDataUrlService: DxDataUrlService,
        private libraryTemplateTypeService: LibraryTemplateTypeService,
        private alertService: AlertService,
        private libraryTemplateService: LibraryTemplateService,
        private devextremeAuthService: DevextremeAuthService,
        private libraryPatientChartDocumentService: LibraryPatientChartDocumentService) {
        super();

        this.init();
    }

    deactivateTemplate(template, $event) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to deactivate template ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.template.isActive = false;
                this.template.templateOrder = null;
                this.libraryTemplateService.activateDeactivateTemplate(template.id, false)
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
                this.template.isActive = false;
                this.template.templateOrder = null;
                this.libraryTemplateService.activateDeactivateTemplate(template.id, true)
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

        this.libraryTemplateService.getById(templateId)
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
        this.libraryTemplateService
            .reorderTemplates($event)
            .then(() => this.templatesGrid.instance
                .getDataSource().reload())
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    insertHtmlElementIntoRTXEditor($event: string) {
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

        this.libraryTemplateService
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
                        this.libraryTemplateService.delete(template.id)
                            .then(() => {
                                this.templatesGrid
                                    .instance.getDataSource().reload();
                            })
                            .catch((error) => this.alertService.error(error.message ? error.message : error));
                    }
                });
            });
    }

    onlibraryTemplateTypeChanged($event): void {
        const libraryTemplateTypeId = $event.value;
        if (!libraryTemplateTypeId)
            return;

        this.libraryTemplateTypeService.getById(libraryTemplateTypeId)
            .then(libraryTemplateType => {
                this.template.templateTypeId = libraryTemplateType.id;
                this.selectedlibraryTemplateTypeId = libraryTemplateType.id;

                if (this.templatesGrid) {
                    this.templatesGrid.instance.refresh();
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private canDeleteTemplate(templateId: string, companyId: string): Promise<CanDeleteResult> {
        return this.libraryPatientChartDocumentService
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
        this.libraryTemplateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.libraryTemplateTypes),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private initTemplateDataSource() {
        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.libraryTemplates),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.templateTypeId = this.selectedlibraryTemplateTypeId;
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
        this.template.templateTypeId = this.selectedlibraryTemplateTypeId;
        this.initTemplateDataSource();
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
}