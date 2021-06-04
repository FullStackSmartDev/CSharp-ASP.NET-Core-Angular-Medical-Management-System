import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../provider/dataService';
import CustomStore from 'devextreme/data/custom_store';
import { TableNames } from '../../constants/tableNames';
import { StringHelper } from '../../helpers/stringHelper';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { ToastService } from '../../provider/toastService';
import { AdminSelectableRootComponent } from '../templateSelectableItemsManagement/admin/adminSelectableRootComponent/adminSelectableRootComponent';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { TemplateTypeDataService, TemplateDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { Template } from '../../dataModels/template';
import { EntityNameService } from '../../provider/entityNameService';
import { LoadPanelService } from '../../provider/loadPanelService';
import { AlertService } from '../../provider/alertService';
import { PatientSelectableRootComponent } from '../templateSelectableItemsManagement/patient/patientSelectableRootComponent/patientSelectableRootComponent';
import { TemplateLookupItemTrackersUpdateService } from '../../provider/templateLookupItemTrackersUpdateService';
import { AdminRichTextEditorComponent } from '../templateSelectableItemsManagement/base/adminRichTextEditorComponent';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';

@Component({
    templateUrl: 'templateCreationComponent.html',
    selector: 'template-creation-component'
})

export class TemplateCreationComponent extends BaseComponent {
    @ViewChild("templatesGrid") templatesGrid: DxDataGridComponent;
    @ViewChild("adminSelectableRootComponent") adminSelectableRootComponent: AdminSelectableRootComponent;
    @ViewChild("templateCreationPopup") templateCreationPopup: DxPopupComponent;
    @ViewChild("templateCreationForm") templateCreationForm: DxFormComponent;

    @ViewChild("detailedRichTextEditor") detailedRichTextEditor: AdminRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor") defaultRichTextEditor: AdminRichTextEditorComponent;


    @ViewChild("patientSelectableRoot") patientSelectableRoot: PatientSelectableRootComponent;

    _isDefaultTemplateEnabled: boolean = false;

    get isDefaultTemplateEnabled(): boolean {
        return this._isDefaultTemplateEnabled;
    }

    set isDefaultTemplateEnabled(value: boolean) {
        if (!value) {
            this.template.DefaultTemplateHtml = "";
        }

        this._isDefaultTemplateEnabled = value;
    }

    templateOrderBeforeDelete: number = null;

    orderNumberMinAvailableValue: number = null;
    orderNumberMaxAvailableValue: number = null;

    isManangeTemplateOrderModalFormVisible: boolean = false;

    templates: Array<any> = [];

    templateType: any;

    deleteBtnKeyCode: number = 46;
    backspaceBtnKeyCode: number = 8;

    handleTextDeleting: boolean = true;

    detailedTemplateEditorVisible: boolean = false;

    isTemplateCreateUpdateFormVisible: boolean = false;

    templateItemId: string = "";
    template: Template;
    selectedTemplates: Array<Template>;

    templateTypeDataSource: any = {};
    templatesGridDataSource: any = {};

    isTemplateCreationFormVisible: boolean = false;
    isNewTemplate: boolean;

    isDetailedTemplatePreviewVisible: boolean = false;

    constructor(private templateDataService: TemplateDataService,
        private lookupDataSourceProvider: LookupDataSourceProvider,
        private templateLookupItemTrackersUpdateService: TemplateLookupItemTrackersUpdateService,
        private loadPanelService: LoadPanelService,
        private alertService: AlertService,
        dataService: DataService,
        toastService: ToastService,
        private templateTypeDataService: TemplateTypeDataService,
        private entityNameService: EntityNameService) {
        super(dataService, toastService);

        this.init()
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
                this.loadPanelService.showLoader();

                const templateOrder = template.TemplateOrder;

                const reorderPromise = this.reorderTemplatesOnDelete(templateOrder);

                const filter = `WHERE Id = '${template.Id}'`;
                const deletePromise = this.templateDataService
                    .delete(filter, template);

                Promise.all([reorderPromise, deletePromise])
                    .then(() => {
                        this.templatesGrid.instance.refresh();
                        this.loadPanelService.hideLoader();
                    })
                    .catch((error) => {
                        this.loadPanelService.hideLoader();
                        this.alertService.alert(error.message ? error.message : error, "ERROR");
                    });
            }
        })
    }

    validateGeneratedName(params) {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.templateDataService)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.template.Name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    get isOrderTextBoxReadonly(): boolean {
        return !this.isNewTemplate
            || (this.orderNumberMinAvailableValue === this.orderNumberMaxAvailableValue)
    }

    openTemplateOrderManagementPopup($event) {
        $event.preventDefault();

        this.loadPanelService
            .showLoader();

        this.loadTemplates()
            .then(templates => {
                this.templates = templates;

                this.loadPanelService
                    .hideLoader();

                this.isManangeTemplateOrderModalFormVisible = true;
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "ERROR");
            })
    }

    switchToTemplatesDataGrid() {
        this.resetCreateUpdateTemplateForm();
        this.isTemplateCreationFormVisible = false;
    }

    switchToTemplateCreationForm() {
        this.isNewTemplate = true;

        this.getTemplateMaxAvailableOrder()
            .then(maxTemplateOrder => {
                this.orderNumberMinAvailableValue = 1;
                this.orderNumberMaxAvailableValue = maxTemplateOrder + 1;

                this.template.TemplateOrder
                    = this.orderNumberMaxAvailableValue;

                this.isTemplateCreationFormVisible = true;
            })
    }

    saveTemplate() {
        const validationResult = this.validateTemplate();

        if (!validationResult.success) {
            this.alertService.alert(validationResult.message, validationResult.title);
            return;
        }

        this.loadPanelService
            .showLoader();

        const reorderTemplates = this.isNewTemplate
            && this.template.TemplateOrder !== this.orderNumberMaxAvailableValue;

        let reorderPromise = Promise.resolve();

        if (reorderTemplates) {
            reorderPromise = this.reorderTemplatesOnSave();
        }

        const createUpdatePromise = this.isNewTemplate
            ? this.templateDataService.create(this.template)
            : this.templateDataService.update(this.template);

        Promise.all([reorderPromise, createUpdatePromise])
            .then((result) => {

                const createUpdateResult = result[1];

                const templateId = createUpdateResult.Id;
                const detailedTemplateContent = createUpdateResult.DetailedTemplateHtml;

                const updateTemplateLookupItemTrackersPromise =
                    detailedTemplateContent ? this.updateTemplateLookupItemTrackers(templateId, detailedTemplateContent) : Promise.resolve();

                updateTemplateLookupItemTrackersPromise
                    .then(() => {
                        this.resetCreateUpdateTemplateForm();
                        this.loadPanelService.hideLoader();
                        this.isTemplateCreationFormVisible = false;
                        this.toastService
                            .showSuccessMessage(StringHelper.format("Template {0}", this.isNewTemplate ? "created" : "updated"));
                    });

            })
            .catch(error => {
                this.toastService
                    .showErrorMessage(this.getErrorMessage(error));
            });
    }

    onTemplateChanged($event) {
        const template = $event.selectedRowKeys[0];
        if (!template) {
            return;
        }
        const templateId = template.Id
        if (!templateId)
            return;

        this.loadPanelService
            .showLoader();

        this.templateDataService
            .getById(templateId)
            .then(template => {
                this.template = template
                    .createFromEntityModel(template);

                this.isNewTemplate = false;

                if (this.template.DefaultTemplateHtml) {
                    this.isDefaultTemplateEnabled = true;
                }

                this.isTemplateCreationFormVisible = true;

                this.loadPanelService.hideLoader();
            })
            .catch(error => this
                .toastService.showErrorMessage(this.getErrorMessage(error)));
    }

    tempateTypeChanged($event) {
        const templateTypeId = $event.value;
        if ($event.value)
            this.template.TemplateTypeId = templateTypeId;
    }

    onTemplatesReordered($event) {
        this.loadPanelService
            .showLoader();

        const fromIndex = $event.fromIndex;
        const toIndex = $event.toIndex;

        const increaseOrder = toIndex > fromIndex;

        const shiftNumber = increaseOrder
            ? toIndex - fromIndex
            : fromIndex - toIndex;

        $event.itemData.TemplateOrder = increaseOrder
            ? $event.itemData.TemplateOrder + shiftNumber
            : $event.itemData.TemplateOrder - shiftNumber;

        let templatesToUpdate = [$event.itemData];

        let orderTemplatesChanged = [];

        if (increaseOrder) {
            orderTemplatesChanged = this.templates
                .slice(fromIndex + 1, toIndex + 1);
            orderTemplatesChanged.forEach(t => t.TemplateOrder = t.TemplateOrder - 1);
        }
        else {
            orderTemplatesChanged = this.templates
                .slice(toIndex, fromIndex);
            orderTemplatesChanged.forEach(t => t.TemplateOrder = t.TemplateOrder + 1);
        }

        templatesToUpdate = templatesToUpdate
            .concat(orderTemplatesChanged);

        if (templatesToUpdate.length) {
            const updatePromises = [];

            for (let i = 0; i < templatesToUpdate.length; i++) {
                const templateToUpdate = templatesToUpdate[i];
                const updatePromise = this.templateDataService
                    .update(templateToUpdate);
                updatePromises.push(updatePromise);
                Promise.all(updatePromises)
                    .then(() => {
                        this.loadTemplates()
                            .then((templates) => {
                                this.templates = templates;

                                this.templatesGrid.instance.refresh();
                                this.loadPanelService.hideLoader();
                            });
                    })
                    .catch(error => {
                        this.loadPanelService.hideLoader();
                        this.alertService
                            .alert(error.message ? error.message : error, "Error");
                    })
            }
        }
        else {
            this.loadPanelService.hideLoader();
        }
    }

    onTemplateTypeChanged(templateTypeId: string) {
        if (!templateTypeId) {
            return;
        }

        this.templateTypeDataService.
            getById(templateTypeId)
            .then(templateType => {
                this.templateType = templateType;
                this.template.TemplateTypeId = this.templateType.Id;

                if (this.templatesGrid) {
                    this.templatesGrid.instance.refresh();
                }
            })
            .catch(error => this.toastService.showErrorMessage(error));
    }

    initTemplatesGridDataSource(): any {
        this.templatesGridDataSource.store =
            this.getTemplatesGridLookupDataSource();
    }

    initTemplateTypeDataSource(): any {
        this.templateTypeDataSource.store = this.lookupDataSourceProvider
            .templateTypeLookupDataSource;
    }

    onSelectableItemValueGenerated($event) {
        this.detailedRichTextEditor
            .insertContent($event);
    }

    showDetailedTemplatePreview() {
        this.isDetailedTemplatePreviewVisible = true;
    }

    private reorderTemplatesOnSave(): Promise<any> {
        return this.reorderTemplates(false);
    }

    private reorderTemplatesOnDelete(templateOrder: number): Promise<any> {
        return this.reorderTemplates(true, templateOrder);
    }

    private reorderTemplates(isDeleteAction: boolean,
        templateOrder: number = null): Promise<any> {

        const order = templateOrder
            ? templateOrder
            : this.template.TemplateOrder

        const loadOptions = {
            filter: [
                ["TemplateOrder", isDeleteAction ? ">" : ">=", order],
                "and",
                ["TemplateTypeId", "=", this.templateType.Id]
            ],
            requireTotalCount: true
        }

        return this.templateDataService
            .searchWithCount(loadOptions, "Id")
            .then(templatesResult => {
                const templates = templatesResult.data;
                if (templates && templates.length) {
                    templates.forEach(t => {
                        if (isDeleteAction) {
                            t.TemplateOrder -= 1
                        }
                        else {
                            t.TemplateOrder += 1
                        }
                    });

                    const templateUpdatePromises = [];
                    templates.forEach(t => {
                        const updatePromise =
                            this.templateDataService
                                .update(t);
                        templateUpdatePromises.push(updatePromise);
                    });

                    return Promise.all(templateUpdatePromises)
                }

                return Promise.resolve([]);
            })
    }

    private updateTemplateLookupItemTrackers(templateId: string,
        detailedTemplateContent: string): Promise<void> {
        return this.templateLookupItemTrackersUpdateService
            .update(templateId, detailedTemplateContent);
    }

    private resetCreateUpdateTemplateForm() {
        this.templateItemId = "";
        this.templateOrderBeforeDelete = null;
        this.template = new Template();

        if (this.templateType) {
            this.template.TemplateTypeId =
                this.templateType.Id
        }

        this.isDefaultTemplateEnabled = false;
        this.detailedTemplateEditorVisible = false;
        this.selectedTemplates = [];
        this.isNewTemplate = true;
    }

    private getTemplateMaxAvailableOrder(): Promise<number> {
        const loadOptions = {
            filter: ["TemplateTypeId", "=", this.templateType.Id],
            requireTotalCount: true
        }

        return this.templateDataService
            .count(loadOptions, "Id")
    }

    private init(): any {
        this.validateGeneratedName =
            this.validateGeneratedName.bind(this);

        this.template = new Template();
        this.isNewTemplate = true;

        this.initTemplateTypeDataSource();
        this.initTemplatesGridDataSource();
    }

    private loadTemplates(): Promise<any> {
        const loadOptions = {
            filter: ["TemplateTypeId", "=", this.templateType.Id],
            sort: [
                {
                    selector: "TemplateOrder",
                    desc: false,
                    nullValuesAtTheEnd: true
                }
            ]
        }

        return this.templateDataService
            .search(loadOptions);
    }

    private getTemplatesGridLookupDataSource() {
        const self = this;
        return new CustomStore({
            load: (loadOptions: any) => {
                const byTypeIdFilter = ["TemplateTypeId", "=", self.templateType.Id]
                if (!loadOptions.filter) {
                    loadOptions.filter = byTypeIdFilter;
                }
                else {
                    if (ArrayHelper.isArray(loadOptions.filter[0])) {
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(byTypeIdFilter);
                    }
                    else {
                        loadOptions.filter = [
                            loadOptions.filter,
                            "and",
                            byTypeIdFilter
                        ]
                    }
                }
                const sortFilters = [
                    {
                        selector: "TemplateOrder",
                        desc: false,
                        nullValuesAtTheEnd: true
                    }
                ]
                loadOptions.sort = sortFilters;

                return self.templateDataService
                    .searchWithCount(loadOptions, "Id");
            }
        });
    }

    private validateTemplate(): any {
        const validationResult =
            this.templateCreationForm.instance.validate();

        this.template.DetailedTemplateHtml =
            this.detailedRichTextEditor.content;

        if (this.isDefaultTemplateEnabled) {
            this.template.DefaultTemplateHtml =
                this.defaultRichTextEditor.content;
        }


        if (!validationResult.isValid) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "Navigate to the 'Base Info' tab"
            };
        }

        if (!this.template.DetailedTemplateHtml) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "The detailed template content is required"
            };
        }

        if (this.isDefaultTemplateEnabled && !this.template.DefaultTemplateHtml) {
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