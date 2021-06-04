import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../provider/dataService';
import CustomStore from 'devextreme/data/custom_store';
import { BaseComponent } from '../baseComponent';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { ToastService } from '../../provider/toastService';
import { TemplateLookupItemViewDataService } from '../../provider/dataServices/read/readDataServices';
import { TemplateLookupItem } from '../../dataModels/templateLookupItem';
import { LoadPanelService } from '../../provider/loadPanelService';
import { EntityNameService } from '../../provider/entityNameService';
import { AlertService } from '../../provider/alertService';
import { TemplateLookupItemDataService, CategoryDataService, TemplateLookupItemTrackerDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';

@Component({
  templateUrl: 'templateLookupItemManagement.html',
  selector: 'template-lookup-item-management'
})

export class TemplateLookupItemManagement extends BaseComponent {
  @ViewChild("lookupItemDataGrid") lookupItemDataGrid: DxDataGridComponent;
  @ViewChild("createUpdateLookupItemPopup") createUpdateLookupItemPopup: DxPopupComponent;
  @ViewChild("lookupItemCreationForm") lookupItemCreationForm: DxFormComponent;

  jsonValues: string;

  lookupItemsDataSource: any = {};
  categoryDataSource: any = {};

  lookupItem: TemplateLookupItem;
  selectedLookupItems: Array<any> = [];

  isCreateUpdatePopupOpened: boolean = false;
  isNewLookupItem: boolean = true;

  constructor(dataService: DataService,
    toastService: ToastService,
    private templateLookupItemDataService: TemplateLookupItemDataService,
    private templateLookupItemViewDataService: TemplateLookupItemViewDataService,
    private lookupDataSourceProvider: LookupDataSourceProvider,
    private loadPanelService: LoadPanelService,
    private alertService: AlertService,
    private entityNameService: EntityNameService,
    private templateLookupItemTrackerDataService: TemplateLookupItemTrackerDataService) {

    super(dataService, toastService);
    this.init();
  }

  openTemplateLookupItemCreationForm() {
    this.isCreateUpdatePopupOpened = true;
  }

  onCreateUpdatePopupHidden() {
    this.resetCreateUpdateLookupItemForm();
  }

  validateGeneratedName(params) {
    const value = params.value;
    this.entityNameService
      .tryGetUniqueNameForEntityRecord(value, this.templateLookupItemDataService)
      .then(validationResult => {
        const isValidationSucceeded
          = validationResult.success;

        if (isValidationSucceeded) {
          this.lookupItem.Name = validationResult.generatedName;
        }

        params.rule.isValid = isValidationSucceeded;
        params.rule.message = validationResult.errorMessage;

        params.validator.validate();
      });

    return false;
  }

  onLookupItemFieldChanged($event) {
    const dataField = $event.dataField;
    if (!this.isNewLookupItem && dataField === "IsActive" && !$event.value) {
      this.loadPanelService.showLoader();

      const templateLookupItemId = this.lookupItem.Id;

      this.checkIfLookupItemUsedInTemplates(templateLookupItemId)
        .then(checkResult => {
          this.loadPanelService.hideLoader();

          if (checkResult) {
            this.lookupItem.IsActive = true;
            this.alertService
              .alert("The selectable list is used in templates. You cannot deactivate it.", "WARNING");
            return;
          }
        });
    }
  }

  createUpdateLookupItem() {
    const validationResult = this.lookupItemCreationForm
      .instance
      .validate();

    if (!validationResult.isValid) {
      return;
    }

    const isTemplateLookupListHasDefaultValue =
      this.isTemplateLookupListHasDefaultValue();

    if (!isTemplateLookupListHasDefaultValue) {
      this.alertService
        .alert("List should have at least one default value.", "WARNING");
      return;
    }

    this.loadPanelService
      .showLoader("Saving...");

    this.createUpdateLookupItemInternally();
  }

  onLookupItemSelected($event) {
    this.isNewLookupItem = false;

    const selectedLookupItem = $event.selectedRowsData[0];
    if (!selectedLookupItem)
      return;

    const selectedLookupItemId = selectedLookupItem
      .TemplateLookupItem_Id;

    this.templateLookupItemDataService
      .getById(selectedLookupItemId)
      .then((lookupItem) => {
        this.lookupItem = lookupItem;
        this.jsonValues = this.lookupItem.JsonValues;
        this.isCreateUpdatePopupOpened = true;
      })
      .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
  }

  onLookupItemListChanged($event) {
    this.lookupItem.JsonValues =
      $event;
  }

  deleteLookupItem(lookupItem: any, $event: any) {
    $event.stopPropagation();

    const templateLookupItemId =
      lookupItem.TemplateLookupItem_Id;

    this.checkIfLookupItemUsedInTemplates(templateLookupItemId)
      .then(checkResult => {
        if (checkResult) {
          this.alertService
            .alert("The selectable list is used in templates. You cannot delete it.", "WARNING");
          return;
        }

        this.continueDeletingLookupItemAfterCheck(templateLookupItemId);
      });
  }

  private continueDeletingLookupItemAfterCheck(templateLookupItemId: string): void {
    const confirmationPopup = this.alertService
      .confirm("Are you sure you want to delete this item ?", "Confirm deletion");

    confirmationPopup.then(dialogResult => {
      if (dialogResult) {
        this.loadPanelService
          .showLoader("Deleting...");

        const filter = `WHERE Id = '${templateLookupItemId}'`;

        this.templateLookupItemDataService.getById(templateLookupItemId)
          .then((templateLookupItem) => {
            this.templateLookupItemDataService.delete(filter, templateLookupItem)
              .then(() => {
                this.lookupItemDataGrid.instance.refresh();
                this.loadPanelService
                  .hideLoader();
              });
          });
      }
    });
  }

  private checkIfLookupItemUsedInTemplates(templateLookupItemId: string): Promise<boolean> {
    const loadOptions = {
      filter: ["TemplateLookupItemId", "=", templateLookupItemId]
    };

    return this.templateLookupItemTrackerDataService
      .firstOrDefault(loadOptions)
      .then(templateLookupItem => {
        return !!templateLookupItem;
      });
  }

  private isTemplateLookupListHasDefaultValue(): boolean {
    const lookupItemList =
      JSON.parse(this.lookupItem.JsonValues).Values;

    const templateLookupItemDefaultValue = lookupItemList
      .filter(li => li.IsDefault)[0];

    return templateLookupItemDefaultValue ? true : false;
  }

  private createUpdateLookupItemInternally(): any {
    const lookupItem = this.lookupItem;
    const createUpdateLookupItemPromise = this.isNewLookupItem
      ? this.templateLookupItemDataService.create(lookupItem)
      : this.templateLookupItemDataService.update(lookupItem);

    createUpdateLookupItemPromise
      .then(() => {
        this.lookupItemDataGrid
          .instance
          .refresh();

        this.resetCreateUpdateLookupItemForm();

        this.isCreateUpdatePopupOpened = false;

        this.loadPanelService
          .hideLoader();

        this.toastService
          .showSuccessMessage("Lookup item was updated successfuly");
      })
      .catch(error => {
        this.loadPanelService.hideLoader();
        this.alertService
          .alert(error.message ? error.message : error, "Error")
      });
  }

  private resetCreateUpdateLookupItemForm() {
    this.lookupItem = new TemplateLookupItem();
    this.jsonValues = this.lookupItem.JsonValues;
    this.isNewLookupItem = true;
    this.selectedLookupItems = [];
  }

  private init(): any {
    this.initLookupItemDataSource();
    this.initCategoryDataSource();

    this.lookupItem =
      new TemplateLookupItem();

    this.jsonValues = this.lookupItem.JsonValues;
    this.isNewLookupItem = true;

    this.validateGeneratedName = this.validateGeneratedName
      .bind(this);
  }

  private initCategoryDataSource() {
    this.categoryDataSource.store = this.lookupDataSourceProvider
      .lookupItemCategoryDataSource;
  }

  private initLookupItemDataSource(): any {
    const self = this;
    this.lookupItemsDataSource.store = new CustomStore({
      byKey: (key) => {
        return self.templateLookupItemDataService
          .getById(key);
      },
      load: (loadOptions: any) => {
        return self.templateLookupItemViewDataService
          .searchWithCount(loadOptions, "TemplateLookupItem_Id")
          .catch(error => self.toastService.showErrorMessage(error.message ? error.message : error));
      }
    });
  }
}