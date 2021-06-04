import { Component, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DataService } from '../../provider/dataService';
import { DxDataGridComponent, DxPopupComponent, DxValidatorComponent, DxFormComponent } from '../../../node_modules/devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { ToastService } from '../../provider/toastService';
import { LoadPanelService } from '../../provider/loadPanelService';
import { TemplateLookupItemCategory } from '../../dataModels/templateLookupItemCategory';
import { EntityNameService } from '../../provider/entityNameService';
import { AlertService } from '../../provider/alertService';
import { CategoryDataService, TemplateLookupItemDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';

@Component({
  templateUrl: 'templateLookupItemCategoryManagement.html',
  selector: 'template-lookup-item-category-management'
})

export class TemplateLookupItemCategoryManagement extends BaseComponent {
  @ViewChild("categoryDataGrid") categoryDataGrid: DxDataGridComponent;
  @ViewChild("createUpdateTemplateTypePopup") createUpdateTemplateTypePopup: DxPopupComponent;
  @ViewChild("categoryCreationForm") categoryCreationForm: DxFormComponent;

  _createUpdateTemplateTypeState: any = null;

  selectedCategories: Array<any> = [];
  category: TemplateLookupItemCategory;
  isNewCategory: boolean = true;

  categoryDataSource: any = {};

  isCreateUpdatePopupOpened: boolean = false;

  constructor(dataService: DataService,
    toastService: ToastService,
    private entityNameService: EntityNameService,
    private categoryDataService: CategoryDataService,
    private templateLookupItemDataService: TemplateLookupItemDataService,
    private loadPanelService: LoadPanelService,
    private alertService: AlertService) {

    super(dataService, toastService);
    this.init();
  }

  openCategoryCreationForm() {
    this.isCreateUpdatePopupOpened = true;
  }

  validateGeneratedName(params) {
    const value = params.value;
    this.entityNameService
      .tryGetUniqueNameForEntityRecord(value, this.categoryDataService)
      .then(validationResult => {
        const isValidationSucceeded
          = validationResult.success;

        if (isValidationSucceeded) {
          this.category.Name = validationResult.generatedName;
        }

        params.rule.isValid = isValidationSucceeded;
        params.rule.message = validationResult.errorMessage;

        params.validator.validate();
      });

    return false;
  }

  createUpdateCategory() {
    const validationResult = this.categoryCreationForm
      .instance
      .validate();

    if (!validationResult.isValid) {
      return;
    }

    this.loadPanelService
      .showLoader("Saving...");

    this.createUpdateCategoryInternally();
  }

  onCategorySelected($event) {
    const selectedCategory = $event.selectedRowsData[0];
    if (!selectedCategory)
      return;

    const selectedCategoryId = $event.selectedRowsData[0].Id;

    this.categoryDataService
      .getById(selectedCategoryId)
      .then((category) => {
        this.category = category;
        this.isNewCategory = false;
        this.isCreateUpdatePopupOpened = true;
      })
      .catch(error => this.toastService
        .showErrorMessage(error.message ? error.message : error));
  }

  onCreateUpdatePopupHidden() {
    this.resetCreateUpdateCategoryForm();
  }

  onCategoryFieldChanged($event) {
    const dataField = $event.dataField;
    if (!this.isNewCategory && dataField === "IsActive" && !$event.value) {
      this.loadPanelService.showLoader();

      const categoryId = this.category.Id;
      this.canDeactivateDeleteLocation(categoryId, false)
        .then(canDeactivate => {
          this.loadPanelService.hideLoader();

          if (!canDeactivate) {
            this.category.IsActive = true;
            this.alertService.alert("Catgeory already is used. You cannot deactivate it.", "WARNING");
          }
        });
    }
  }

  deleteCategory(category: any, $event: any) {
    $event.stopPropagation();

    this.loadPanelService
      .showLoader();

    const categoryId = category.Id;

    this.canDeactivateDeleteLocation(categoryId, true)
      .then(canDelete => {
        this.loadPanelService
          .hideLoader();

        if (!canDelete) {
          this.alertService.alert("Category already is used. You cannot delete it.", "WARNING");
          return;
        }

        this.continueDeletingLocation(categoryId);
      });
  }

  private createUpdateCategoryInternally() {
    const createUpdateCategoryPromise = this.isNewCategory
      ? this.categoryDataService.create(this.category)
      : this.categoryDataService.update(this.category);

    createUpdateCategoryPromise
      .then(() => {
        this.categoryDataGrid.instance
          .refresh();

        this.resetCreateUpdateCategoryForm();
        this.isCreateUpdatePopupOpened = false;

        this.loadPanelService.hideLoader();

        this.toastService
          .showSuccessMessage("Category was updated successfuly");
      })
      .catch(error => {
        this.loadPanelService.hideLoader();
        this.alertService
          .alert(error.message ? error.message : error, "Error");
      });
  }

  private continueDeletingLocation(categoryId: string): void {
    const confirmationPopup = this.alertService
      .confirm("Are you sure you want to delete the category ?", "Confirm deletion");

    confirmationPopup.then(dialogResult => {
      if (dialogResult) {
        this.loadPanelService
          .showLoader();

        const filter = `WHERE Id = '${categoryId}'`;

        this.categoryDataService.getById(categoryId)
          .then((category) => {
            this.categoryDataService.delete(filter, category)
              .then(() => {
                this.categoryDataGrid
                  .instance.refresh();

                this.loadPanelService
                  .hideLoader();
              });
          });
      }
    });
  }

  private canDeactivateDeleteLocation(categoryId: string, isDeleteAction: boolean): Promise<boolean> {
    const loadOptions = {
      filter: ["TemplateLookupItemCategoryId", "=", categoryId]
    };

    return this.templateLookupItemDataService.search(loadOptions)
      .then(lookupItems => {
        const areActiveLookupItemsExist = isDeleteAction
          ? !!lookupItems.length
          : !!lookupItems.filter(r => r.IsActive).length;
        return !areActiveLookupItemsExist;
      })
  }

  private resetCreateUpdateCategoryForm() {
    this.isNewCategory = true;
    this.category = new TemplateLookupItemCategory();
    this.selectedCategories = [];
  }

  private init(): any {
    this.validateGeneratedName = this.validateGeneratedName
      .bind(this);
    this.category = new TemplateLookupItemCategory();
    this.initTemplateTypeDataSource();
  }

  private initTemplateTypeDataSource(): any {
    const self = this;
    this.categoryDataSource.store = new CustomStore({
      byKey: (key) => {
        if (!key)
          return Promise.resolve()
        return self.categoryDataService
          .getById(key);
      },
      load: (loadOptions: any) => {
        return self.categoryDataService
          .searchWithCount(loadOptions, "Id")
          .catch(error => self.toastService
            .showErrorMessage(error.message ? error.message : error));
      }
    });
  }
}