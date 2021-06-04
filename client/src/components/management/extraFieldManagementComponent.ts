import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxSelectBoxComponent, DxTextBoxComponent, DxFormComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import CustomStore from 'devextreme/data/custom_store';
import { DataService } from '../../provider/dataService';
import { TableNames } from '../../constants/tableNames';
import { ToastService } from '../../provider/toastService';
import { ExtraField } from '../../dataModels/extraField';
import { EntityNameService } from '../../provider/entityNameService';
import { ExtraFieldDataService, EntityExtraFieldMapDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LoadPanelService } from '../../provider/loadPanelService';
import { alert } from 'devextreme/ui/dialog';
import { confirm } from 'devextreme/ui/dialog';

@Component({
    templateUrl: 'extraFieldManagementComponent.html',
    selector: 'extra-field-management'
})

export class ExtraFieldManagementComponent extends BaseComponent implements AfterViewInit {
    @ViewChild("extraFieldsDataGrid") extraFieldsDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateExtraFieldPopup") createUpdateExtraFieldPopup: DxPopupComponent;
    @ViewChild("extraFieldCreationForm") extraFieldCreationForm: DxFormComponent;

    relatedEntityNames: Array<string> = [
        TableNames.company,
        TableNames.room,
        TableNames.location,
        TableNames.employee
    ];

    isNewExtraField: boolean = true;
    extraField: any;
    extraFieldsDataSource: any = {};
    selectedExtraFields: Array<any> = [];

    isCreateUpdatePopupOpened: boolean = false;

    constructor(dataService: DataService,
        toastService: ToastService,
        private entityExtraFieldMapDataService: EntityExtraFieldMapDataService,
        private loadPanelService: LoadPanelService,
        private entityNameService: EntityNameService,
        private extraFieldDataService: ExtraFieldDataService) {
        super(dataService, toastService);

        this.init();

        this.validateGeneratedName =
            this.validateGeneratedName.bind(this);
    }

    relatedEntityNameEditorOptions: any = {
        items: this.relatedEntityNames,
        readOnly: false
    }

    extraFieldTypeEditorOptions: any = {
        displayExpr: "Name",
        valueExpr: "Value",
        dataSource: this.lookups.extraFieldType,
        readOnly: false
    }

    validateGeneratedName(params): boolean {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.extraFieldDataService)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.extraField.Name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    ngAfterViewInit() {
        this.createUpdateExtraFieldPopup
            .instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            })
    }

    openExtraFieldCreationForm() {
        this.isCreateUpdatePopupOpened = true;
    }

    onCloseExtraFieldCreationForm() {
        this.resetExtraFieldCreationFormData();
        this.selectedExtraFields = [];
    }

    createUpdateExtraField() {
        const validationResult = this.extraFieldCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.loadPanelService.showLoader();

        const createUpdateExtraFieldPromise = this.isNewExtraField
            ? this.extraFieldDataService.create(this.extraField)
            : this.extraFieldDataService.update(this.extraField);

        createUpdateExtraFieldPromise
            .then(() => {
                this.selectedExtraFields = [];

                this.extraFieldsDataGrid
                    .instance
                    .refresh();

                this.resetExtraFieldCreationFormData();

                this.isCreateUpdatePopupOpened = false;

                this.loadPanelService.hideLoader();

                this.toastService
                    .showSuccessMessage("Extra field was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.toastService.showErrorMessage(error.message ? error.message : error)
            });
    }

    deleteExtraField(extraField: any, $event: any) {
        $event.stopPropagation();

        const extraFieldId = extraField.Id;
        this.loadPanelService
            .showLoader();

        this.checkIfExtraFieldIsUsed(extraFieldId)
            .then(isExtraFieldUsed => {
                if (isExtraFieldUsed) {
                    this.loadPanelService.hideLoader();
                    alert("The extra field already used. You cannot delete it.", "WARNING");
                    return;
                }

                this.continueDeletingExtraFieldAfterCheck(extraFieldId)
                    .then((result) => {
                        this.loadPanelService
                            .hideLoader();
                        if (result) {
                            this.extraFieldsDataGrid.instance.refresh();
                            this.toastService.showSuccessMessage("Extra field was deleted uccesfully.");
                        }
                    });
            });
    }

    onExtraFieldSelected($event) {
        const selectedExtraGrid = $event.selectedRowsData[0];
        if (!selectedExtraGrid) {
            return;
        }

        const selectedExtraGridId = selectedExtraGrid.Id;
        if (!selectedExtraGridId) {
            this.selectedExtraFields = [];
            return;
        }

        this.extraFieldDataService.getById(selectedExtraGridId)
            .then((extraField) => {
                this.isNewExtraField = false;
                this.extraField = extraField;

                this.adjustReadonlyFields(true);

                this.isCreateUpdatePopupOpened = true;
            })
            .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
    }

    private continueDeletingExtraFieldAfterCheck(extraFieldId: string): Promise<any> {
        const confirmationPopup = confirm("Are you sure you want to delete this item ?", "Confirm deletion");

        return confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.loadPanelService
                    .showLoader("Deleting...");

                const filter = `WHERE Id = '${extraFieldId}'`;

                return this.extraFieldDataService.getById(extraFieldId)
                    .then((extraField) => {
                        return this.extraFieldDataService
                            .delete(filter, extraField);
                    });
            }

            return Promise.resolve(false);
        });
    }

    private checkIfExtraFieldIsUsed(extraFieldId: string): Promise<boolean> {
        const extraFieldFilter = ["ExtraFieldId", "=", extraFieldId];
        const loadOptions = {
            filter: extraFieldFilter
        };

        return this.entityExtraFieldMapDataService.firstOrDefault(loadOptions)
            .then(entityExtraFieldMap => {
                return !!entityExtraFieldMap;
            });
    }

    private resetExtraFieldCreationFormData(): void {
        this.isNewExtraField = true;
        this.extraField = new ExtraField();
        this.adjustReadonlyFields(false);
    }

    private adjustReadonlyFields(isReadOnly: boolean): any {
        this.relatedEntityNameEditorOptions.readOnly = isReadOnly;
        this.extraFieldTypeEditorOptions.readOnly = isReadOnly;
    }

    private init(): void {
        this.extraField = new ExtraField();
        this.initExtraFieldsDataSource();
    }

    private initExtraFieldsDataSource(): void {
        this.extraFieldsDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key) {
                    return Promise.resolve();
                }
                return this.extraFieldDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                return this.extraFieldDataService
                    .searchWithCount(loadOptions, "Id")
                    .then(extraFieldsResult => {
                        extraFieldsResult.data.forEach(extraField => {
                            this.adjustExtraFieldsBeforeRenderInGrid(extraField);
                        });

                        return extraFieldsResult;
                    });
            }
        });
    }

    private adjustExtraFieldsBeforeRenderInGrid(extraField) {
        extraField.Type = this.lookups.extraFieldType.filter(s => s.Value == extraField.Type)[0].Name;
    }
}