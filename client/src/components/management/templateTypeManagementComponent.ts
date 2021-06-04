import { ViewChild, Component } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidatorComponent } from 'devextreme-angular';
import { DataService } from '../../provider/dataService';
import { ToastService } from '../../provider/toastService';
import { BaseComponent } from '../baseComponent';
import CustomStore from 'devextreme/data/custom_store';
import { EntityNameService } from '../../provider/entityNameService';
import { TemplateType } from '../../dataModels/templateType';
import { LoadPanelService } from '../../provider/loadPanelService';
import { AlertService } from '../../provider/alertService';
import { TemplateTypeDataService, TemplateLookupItemDataService, TemplateDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';

@Component({
    templateUrl: 'templateTypeManagementComponent.html',
    selector: 'template-type-management'
})
export class TemplateTypeManagementComponent extends BaseComponent {
    @ViewChild("templateTypeDataGrid") templateTypeDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateTemplateTypePopup") createUpdateTemplateTypePopup: DxPopupComponent;

    selectedTemplateTypes: Array<any> = [];
    templateType: TemplateType;
    isNewTemplateType: boolean = true;

    templateTypeDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(dataService: DataService,
        toastService: ToastService,
        private templateDataService: TemplateDataService,
        private entityNameService: EntityNameService,
        private templateTypeDataService: TemplateTypeDataService,
        private loadPanelService: LoadPanelService,
        private alertService: AlertService) {

        super(dataService, toastService);
        this.init();
    }

    onTemplateTypeFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewTemplateType && dataField === "IsActive" && !$event.value) {
            this.loadPanelService.showLoader();

            const templateTypeId = this.templateType.Id;
            this.canDeactivateDeleteTemplateType(templateTypeId, false)
                .then(canDeactivate => {
                    this.loadPanelService.hideLoader();

                    if (!canDeactivate) {
                        this.templateType.IsActive = true;
                        this.alertService
                            .alert("Template type is already used. You cannot deactivate it.", "WARNING");
                    }
                });
        }
    }

    deleteTemplateType(templateType: any, $event: any) {
        $event.stopPropagation();

        this.loadPanelService
            .showLoader();

        const templateTypeId = templateType.Id;

        this.canDeactivateDeleteTemplateType(templateTypeId, true)
            .then(canDelete => {
                this.loadPanelService
                    .hideLoader();

                if (!canDelete) {
                    this.alertService.alert("Template type is already used. You cannot delete it.", "WARNING");
                    return;
                }

                this.continueDeletingTemplateType(templateTypeId);
            });
    }

    openTemplateTypeCreationForm() {
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateTemplateTypeForm();
    }

    createUpdateTemplateType() {
        this.loadPanelService
            .showLoader("Saving...");

        this.createUpdateTemplateTypeInternally();
    }

    onTemplateTypeSelected($event) {
        const selectedTemplateType = $event.selectedRowsData[0];
        if (!selectedTemplateType)
            return;

        const selectedTemplateTypeId = $event.selectedRowsData[0].Id;
        this.templateTypeDataService
            .getById(selectedTemplateTypeId)
            .then((templateType) => {
                this.templateType = templateType;
                this.isCreateUpdatePopupOpened = true;
                this.isNewTemplateType = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    validateGeneratedName(params) {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.templateTypeDataService)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.templateType.Name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    private createUpdateTemplateTypeInternally() {
        const createUpdateTemplateTypePromise = this.isNewTemplateType
            ? this.templateTypeDataService.create(this.templateType)
            : this.templateTypeDataService.update(this.templateType);
        createUpdateTemplateTypePromise
            .then(() => {
                this.templateTypeDataGrid.instance
                    .refresh();

                this.resetCreateUpdateTemplateTypeForm();

                this.isCreateUpdatePopupOpened = false;

                this.loadPanelService.hideLoader();

                this.toastService
                    .showSuccessMessage("Template Type was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    private resetCreateUpdateTemplateTypeForm() {
        this.isNewTemplateType = true;
        this.templateType = new TemplateType();
        this.selectedTemplateTypes = [];
    }

    private init(): any {
        this.templateType = new TemplateType();
        this.initTemplateTypeDataSource();

        this.validateGeneratedName = this.validateGeneratedName.bind(this);
    }

    private initTemplateTypeDataSource(): any {
        const self = this;
        this.templateTypeDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.templateTypeDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                return self.templateTypeDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }

    private continueDeletingTemplateType(templateTypeId: string): void {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the template type ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.loadPanelService
                    .showLoader();

                const filter = `WHERE Id = '${templateTypeId}'`;

                this.templateTypeDataService.getById(templateTypeId)
                    .then((templateType) => {
                        this.templateTypeDataService.delete(filter, templateType)
                            .then(() => {
                                this.templateTypeDataGrid
                                    .instance.refresh();

                                this.loadPanelService
                                    .hideLoader();
                            });
                    });
            }
        });
    }

    private canDeactivateDeleteTemplateType(templateTypeId: string,
        isDeleteAction: boolean): Promise<boolean> {
        const loadOptions = {
            filter: ["TemplateTypeId", "=", templateTypeId]
        }

        return this.templateDataService
            .search(loadOptions)
            .then(templates => {
                return isDeleteAction
                    ? !templates.length
                    : !templates.filter(t => !t.IsDelete).length;
            });
    }
}