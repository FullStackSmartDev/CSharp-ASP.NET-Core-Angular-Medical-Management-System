import { Component, Input, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { SelectableListCategory } from 'src/app/administration/models/selectableListCategory';
import { AlertService } from 'src/app/_services/alert.service';
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { SelectableListCategoryService } from 'src/app/administration/services/selectable-list-category.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "selectable-list-category",
    templateUrl: "./selectable-list-category.component.html"
})
export class SelectableListCategoryComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("categoryDataGrid", { static: false }) categoryDataGrid: DxDataGridComponent;
    @ViewChild("categoryPopup", { static: false }) categoryPopup: DxPopupComponent;
    @ViewChild("categoryForm", { static: false }) categoryForm: DxFormComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    selectedCategories: Array<any> = [];
    category: SelectableListCategory;
    isNewCategory: boolean = true;

    categoryDataSource: any = {};

    isCategoryPopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private selectableListCategoryService: SelectableListCategoryService,
        private entityNameService: EntityNameService,
        private dxDataUrlService: DxDataUrlService,
        private selectableListService: SelectableListService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService) {

        super();

        this.init();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    openCategoryForm() {
        this.isCategoryPopupOpened = true;
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.selectableListCategoryService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.category.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    createUpdateCategory() {
        const validationResult = this.categoryForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewCategory) {
            this.category.companyId = this.companyId;
        }

        this.selectableListCategoryService.save(this.category)
            .then(() => {
                this.categoryDataGrid.instance.refresh();

                this.resetCategoryForm();
                this.isCategoryPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    onCategorySelected($event) {
        const selectedCategory = $event.selectedRowsData[0];
        if (!selectedCategory)
            return;

        const selectedCategoryId = $event.selectedRowsData[0].id;

        this.selectableListCategoryService
            .getById(selectedCategoryId)
            .then((category) => {
                this.category = category;
                this.isNewCategory = false;
                this.isCategoryPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onCategoryPopupHidden() {
        this.resetCategoryForm();
    }

    onCategoryFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewCategory && dataField === "isActive" && !$event.value) {

            const categoryId = this.category.id;
            this.canDeactivateDeleteLocation(categoryId, false)
                .then(canDeactivate => {

                    if (!canDeactivate) {
                        this.category.isActive = true;
                        this.alertService.warning("Catgeory already is used. You cannot deactivate it.");
                    }
                });
        }
    }

    deleteCategory(category: any, $event: any) {
        $event.stopPropagation();

        const categoryId = category.id;

        this.canDeactivateDeleteLocation(categoryId, true)
            .then(canDelete => {
                if (!canDelete) {
                    this.alertService.warning("Category already is used. You cannot delete it.");
                    return;
                }

                this.continueDeletingLocation(categoryId);
            });
    }

    private continueDeletingLocation(categoryId: string): void {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the category ? All related selectable lists will be deleted too.", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListCategoryService.delete(categoryId)
                    .then(() => {
                        this.categoryDataGrid.instance.refresh();
                    });
            }
        });
    }

    private canDeactivateDeleteLocation(categoryId: string, isDeleteAction: boolean): Promise<boolean> {
        return this.selectableListService.getByCategoryId(categoryId)
            .then(selectableLists => {
                const areActiveLookupItemsExist = isDeleteAction
                    ? !!selectableLists.length
                    : !!selectableLists.filter(r => r.isActive).length;

                return !areActiveLookupItemsExist;
            })
    }

    private resetCategoryForm() {
        this.isNewCategory = true;
        this.category = new SelectableListCategory();
        this.selectedCategories = [];
    }

    private init(): any {
        this.category = new SelectableListCategory();
        this.initCategoryDataSource();
    }

    private initCategoryDataSource(): any {
        this.categoryDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("selectablelistcategory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.categoryDataGrid && this.categoryDataGrid.instance)
                        this.categoryDataGrid.instance.refresh();
                }
            });
    }
}