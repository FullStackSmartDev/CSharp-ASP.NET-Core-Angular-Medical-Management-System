import { Component, ViewChild, OnInit, OnDestroy, HostListener } from "@angular/core";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { TemplateType } from 'src/app/administration/models/templateType';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataGridComponent, DxFormComponent, DxPopupComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { AdminRichTextEditorComponent } from './admin-rich-text-editor/admin-rich-text-editor.component';
import { ButtonKeyCodes } from 'src/app/_classes/buttonKeyCodes';
import { Template } from 'src/app/_models/template';
import { TemplateService } from 'src/app/_services/template.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { SelectableListTrackService } from 'src/app/administration/services/selectable-list.-track.service';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { PatientSelectableListComponent } from 'src/app/share/components/patient-selectable-list/patient-selectable-list.component';
import { PatientSelectableDateComponent } from 'src/app/share/components/patient-selectable-date/patient-selectable-date.component';
import { PatientSelectableRangeComponent } from 'src/app/share/components/patient-selectable-range/patient-selectable-range.component';
import { PatchService } from 'src/app/_services/patchService';

@Component({
    selector: "admin-template",
    templateUrl: "./admin-template.component.html"
})
export class AdminTemplateComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("templatesGrid", { static: false }) templatesGrid: DxDataGridComponent;
    @ViewChild("templatePopup", { static: false }) templatePopup: DxPopupComponent;
    @ViewChild("templateForm", { static: false }) templateForm: DxFormComponent;

    @ViewChild("templateTypeSelectBox", { static: false }) templateTypeSelectBox: DxSelectBoxComponent;

    @ViewChild("detailedRichTextEditor", { static: false }) detailedRichTextEditor: AdminRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor", { static: false }) defaultRichTextEditor: AdminRichTextEditorComponent;

    selectableRoot: PatientSelectableRootComponent = new PatientSelectableRootComponent();

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

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

    templateOrderBeforeDelete: number = null;

    minAvailableOrder: number = null;
    maxAvailableOrder: number = null;

    isTemplateOrderFormVisible: boolean = false;

    templates: Array<any> = [];

    selectedTemplateTypeId: string = "";
    templateType: TemplateType;
    templateTypeDataSource: any = {};

    deleteBtnKeyCode: number = ButtonKeyCodes.delete;
    backspaceBtnKeyCode: number = ButtonKeyCodes.backspace;

    handleTextDeleting: boolean = true;

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
        private entityNameService: EntityNameService,
        private selectableListTrackService: SelectableListTrackService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService,
        selectableItemHtmlService: SelectableItemHtmlService,
        selectableListService: SelectableListService,
        private patchService: PatchService) {
        super();

        this.initSelectableComponents(selectableItemHtmlService, selectableListService);
        this.init();
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

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    updateTemplatesSelectableItemsMetadataSeparators(): void {
        this.patchService
            .updateTemplatesSelectableItemsMetadataSeparators(this.companyId)
            .then(() => {
                this.alertService.info(`Update templates selectable items metadata separators for company id: ${this.companyId} were updated`);
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    updateSelectableTrackItems(): void {
        this.patchService.updateTemplatesSelectableTrackItems(this.companyId)
            .then(() => {
                this.alertService.info(`Template track items for company id: ${this.companyId} were updated`)
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    setInitialContentForDetailedTemplates(): void {
        this.templateService.getAllByCompanyId(this.companyId)
            .then(templates => {
                for (let i = 0; i < templates.length; i++) {
                    const template = templates[i];
                    if (!template.initialDetailedTemplateHtml) {
                        const detailedTemplateContent = template.detailedTemplateHtml;
                        this.selectableRoot.replaceSelectableItemsCodesWithDefaultValues(detailedTemplateContent)
                            .then(initialTemplateContent => {
                                template.initialDetailedTemplateHtml = initialTemplateContent;
                                this.templateService.save(template)
                                    .then((savedTemplate) => console.log(`Template with name: ${savedTemplate.reportTitle}`))
                            })
                            .catch((error) => this.alertService.error(error.message ? error.message : error));
                    }
                }
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    onTemplateChanged($event) {
        const template = $event.selectedRowKeys[0];
        if (!template) {
            return;
        }
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

    onTemplatesReordered($event) {
        const fromIndex = $event.fromIndex;
        const toIndex = $event.toIndex;

        const increaseOrder = toIndex > fromIndex;

        const shiftNumber = increaseOrder
            ? toIndex - fromIndex
            : fromIndex - toIndex;

        $event.itemData.templateOrder = increaseOrder
            ? $event.itemData.templateOrder + shiftNumber
            : $event.itemData.templateOrder - shiftNumber;

        let templatesToUpdate = [$event.itemData];

        let orderTemplatesChanged = [];

        if (increaseOrder) {
            orderTemplatesChanged = this.templates
                .slice(fromIndex + 1, toIndex + 1);
            orderTemplatesChanged.forEach(t => t.templateOrder = t.templateOrder - 1);
        }
        else {
            orderTemplatesChanged = this.templates
                .slice(toIndex, fromIndex);
            orderTemplatesChanged.forEach(t => t.templateOrder = t.templateOrder + 1);
        }

        templatesToUpdate = templatesToUpdate
            .concat(orderTemplatesChanged);

        if (templatesToUpdate.length) {
            this.templateService.batchUpdate(templatesToUpdate)
                .then(() => {
                    this.loadTemplates()
                        .then((templates) => {
                            this.templates = templates;
                            this.templatesGrid.instance.refresh();
                        });
                })
                .catch(error => {
                    this.alertService
                        .alert(error.message ? error.message : error, "Error");
                })
        }
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

        this.selectableRoot.replaceSelectableItemsCodesWithDefaultValues(this.template.detailedTemplateHtml)
            .then(templateContent => {
                this.template.initialDetailedTemplateHtml = templateContent;

                const reorderTemplates = this.isNewTemplate
                    && this.template.templateOrder !== this.maxAvailableOrder;

                let reorderPromise = Promise.resolve();

                if (reorderTemplates) {
                    reorderPromise = this.reorderTemplatesOnSave();
                }

                if (this.isNewTemplate)
                    this.template.companyId = this.companyId;

                const savePromise = this.templateService.save(this.template);

                Promise.all([reorderPromise, savePromise])
                    .then((result) => {

                        const createUpdateResult = result[1];

                        const detailedTemplateContent =
                            createUpdateResult.detailedTemplateHtml;

                        const updateSelectableListTrackItemsPromise = detailedTemplateContent
                            ? this.updateSelectableListTrackItems(createUpdateResult.id, detailedTemplateContent)
                            : Promise.resolve();

                        updateSelectableListTrackItemsPromise
                            .then(() => {
                                this.resetTemplateForm();
                                this.isTemplateFormVisible = false;
                            });

                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    switchToTemplateForm() {
        this.isNewTemplate = true;

        this.getTemplateMaxAvailableOrder()
            .then(maxTemplateOrder => {
                this.minAvailableOrder = 1;
                this.maxAvailableOrder = maxTemplateOrder + 1;

                this.template.templateOrder = this.maxAvailableOrder;

                this.isTemplateFormVisible = true;
            })
    }

    switchToTemplatesDataGrid() {
        this.resetTemplateForm();
        this.isTemplateFormVisible = false;
    }

    openTemplateOrderManagementPopup() {
        this.loadTemplates()
            .then(templates => {
                this.templates = templates;
                this.isTemplateOrderFormVisible = true;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    get isOrderTextBoxReadonly(): boolean {
        return !this.isNewTemplate || (this.minAvailableOrder === this.maxAvailableOrder)
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.templateService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.template.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    onDetailedTemplatePreviewHidden() {
        this.isDetailedTemplatePreviewVisible = false;
    }

    deleteTemplate(template: any, $event: any) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the template ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                const templateOrder = template.templateOrder;
                const reorderPromise = this.reorderTemplatesOnDelete(templateOrder);

                const deleteTemplatePromise = this.templateService.delete(template.id);

                Promise.all([reorderPromise, deleteTemplatePromise])
                    .then(() => {
                        this.templatesGrid.instance.refresh();
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        })
    }

    onTemplateTypeChanged($event): void {
        const templateTypeId = $event.value;
        if (!templateTypeId)
            return;

        this.templateTypeService.getById(templateTypeId)
            .then(templateType => {
                this.templateType = templateType;

                this.template.templateTypeId = this.templateType.id;

                if (this.templatesGrid) {
                    this.templatesGrid.instance.refresh();
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    private init() {
        this.template = new Template();
        this.isNewTemplate = true;

        this.initTemplateTypeDataSource();
        this.initTemplateDataSource();
    }

    private initTemplateTypeDataSource() {
        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("templatetype"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initTemplateDataSource() {
        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("template"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    const templateTypeId = this.templateType && this.templateType.id ? this.templateType.id : GuidHelper.emptyGuid;
                    jQueryAjaxSettings.data.templateTypeId = templateTypeId;
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private reorderTemplatesOnDelete(templateOrder: number): Promise<any> {
        return this.reorderTemplates(true, templateOrder);
    }

    private reorderTemplates(isDeleteAction: boolean, templateOrder: number = null): Promise<void> {
        const order = templateOrder ? templateOrder : this.template.templateOrder
        const filter = [
            ["templateOrder", isDeleteAction ? ">" : ">=", order],
            "and",
            ["templateTypeId", "=", this.templateType.id],
            "and",
            ["companyId", "=", this.companyId]
        ];

        const loadOptions = { filter: filter, requireTotalCount: true };

        return this.templateDataSource.store._loadFunc(loadOptions)
            .then(templates => {
                if (templates && templates.length) {
                    templates.forEach(t => {
                        if (isDeleteAction) {
                            t.templateOrder -= 1
                        }
                        else {
                            t.templateOrder += 1
                        }
                    });

                    return this.templateService.batchUpdate(templates);
                }

                return Promise.resolve([]);
            })
    }

    private loadTemplates(): Promise<any> {
        const loadOptions = {
            filter: [
                ["templateTypeId", "=", this.templateType.id],
                "and",
                ["companyId", "=", this.companyId]
            ],
            sort: [
                {
                    selector: "templateOrder",
                    desc: false
                }
            ]
        }

        return this.templateDataSource.store._loadFunc(loadOptions);
    }

    private resetTemplateForm() {
        this.templateId = "";
        this.templateOrderBeforeDelete = null;
        this.template = new Template();

        if (this.templateType) {
            this.template.templateTypeId = this.templateType.id;
        }

        this.isDefaultTemplateEnabled = false;
        this.detailedTemplateEditorVisible = false;
        this.selectedTemplates = [];
        this.isNewTemplate = true;
    }

    private getTemplateMaxAvailableOrder(): Promise<number> {
        return this.templateService.countByTemplateType(this.templateType.id);
    }

    private validateTemplate(): any {
        const validationResult = this.templateForm.instance.validate();

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

    private reorderTemplatesOnSave(): Promise<any> {
        return this.reorderTemplates(false);
    }

    private updateSelectableListTrackItems(templateId: string, detailedTemplateContent: string): Promise<void> {
        return this.selectableListTrackService
            .update(templateId, detailedTemplateContent, this.companyId);
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;

                    this.selectableRoot.patientSelectableList.companyId
                        = this.companyId;

                    if (this.templateType) {
                        this.templateType = null;
                        this.selectedTemplateTypeId = "";
                    }
                    if (this.templateTypeSelectBox && this.templateTypeSelectBox.instance) {
                        this.templateTypeSelectBox.instance
                            .getDataSource().reload();
                    }
                }
            });
    }

    private initSelectableComponents(selectableItemHtmlService: SelectableItemHtmlService,
        selectableListService: SelectableListService) {
        this.selectableRoot.patientSelectableList =
            new PatientSelectableListComponent(selectableItemHtmlService, selectableListService, this.alertService);

        this.selectableRoot.patientSelectableDate =
            new PatientSelectableDateComponent(this.alertService, selectableItemHtmlService);

        this.selectableRoot.patientSelectableRange =
            new PatientSelectableRangeComponent(selectableItemHtmlService, this.alertService);
    }
}