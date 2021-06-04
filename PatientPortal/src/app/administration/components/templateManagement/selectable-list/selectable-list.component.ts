import { Component, Input, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { SelectableList } from 'src/app/_models/selectableList';
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { SelectableListTrackService } from 'src/app/administration/services/selectable-list.-track.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "selectable-list",
    templateUrl: "./selectable-list.component.html"
})
export class SelectableListComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("selectableListDataGrid", { static: false }) selectableListDataGrid: DxDataGridComponent;
    @ViewChild("selectableListPopup", { static: false }) selectableListPopup: DxPopupComponent;
    @ViewChild("selectableListForm", { static: false }) selectableListForm: DxFormComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    jsonValues: string;

    selectableListDataSource: any = {};
    categoryDataSource: any = {};

    selectableList: SelectableList;
    selectedSelectableLists: Array<any> = [];

    isSelectableListPopupOpened: boolean = false;
    isNewSelectableList: boolean = true;

    constructor(private selectableListService: SelectableListService,
        private alertService: AlertService,
        private entityNameService: EntityNameService,
        private selectableListTrackService: SelectableListTrackService,
        private dxDataUrlService: DxDataUrlService,
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

    openSelectableListForm() {
        this.isSelectableListPopupOpened = true;
    }

    onSelectableListPopupHidden() {
        this.resetSelectableListForm();
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.selectableListService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.selectableList.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    onSelectableListFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewSelectableList && dataField === "isActive" && !$event.value) {

            const templateLookupItemId = this.selectableList.id;

            this.checkIfSelectableListUsedInTemplates(templateLookupItemId)
                .then(checkResult => {

                    if (checkResult) {
                        this.selectableList.isActive = true;
                        this.alertService
                            .warning("The selectable list is used in templates. You cannot deactivate it.");
                        return;
                    }
                });
        }
    }

    createUpdateSelectableList() {
        const validationResult = this.selectableListForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewSelectableList) {
            this.selectableList.companyId = this.companyId;
        }

        const isSelectableListHasDefaultValue =
            this.isSelectableListHasDefaultValue();

        if (!isSelectableListHasDefaultValue) {
            this.alertService
                .warning("List should have at least one default value.");
            return;
        }

        this.selectableListService.save(this.selectableList)
            .then(() => {
                this.selectableListDataGrid.instance.refresh();

                this.resetSelectableListForm();
                this.isSelectableListPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onSelectableListSelected($event) {
        this.isNewSelectableList = false;

        const selectableList = $event.selectedRowsData[0];
        if (!selectableList)
            return;

        const selectableListId = selectableList.id;

        this.selectableListService
            .getById(selectableListId)
            .then((selectableList) => {
                this.selectableList = selectableList;
                this.jsonValues = this.selectableList.jsonValues;
                this.isSelectableListPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onSelectabeListChanged($event) {
        this.selectableList.jsonValues = $event;
    }

    deleteSelectableList(selectableList: any, $event: any) {
        $event.stopPropagation();

        const selectableListId = selectableList.id;

        this, this.checkIfSelectableListUsedInTemplates(selectableListId)
            .then(checkResult => {
                if (checkResult) {
                    this.alertService
                        .warning("The selectable list is used in templates. You cannot delete it.");
                    return;
                }

                this.continueDeletingLookupItemAfterCheck(selectableListId);
            });
    }

    private continueDeletingLookupItemAfterCheck(selectableListId: string): void {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete this item ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListService.delete(selectableListId)
                    .then(() => {
                        this.selectableListDataGrid.instance.refresh();
                    });
            }
        });
    }

    private checkIfSelectableListUsedInTemplates(selectableListId: string): Promise<boolean> {
        return this.selectableListTrackService
            .getSelectableListId(selectableListId)
            .then(templateLookupItem => {
                return !!templateLookupItem;
            });
    }

    private isSelectableListHasDefaultValue(): boolean {
        const selectableListList =
            JSON.parse(this.selectableList.jsonValues).Values;

        const selectableListDefaultValue = selectableListList
            .filter(li => li.IsDefault)[0];

        return selectableListDefaultValue ? true : false;
    }

    private resetSelectableListForm() {
        this.selectableList = new SelectableList();
        this.jsonValues = this.selectableList.jsonValues;
        this.isNewSelectableList = true;
        this.selectedSelectableLists = [];
    }

    private init(): any {
        this.initSelectableListDataSource();
        this.initCategoryDataSource();

        this.selectableList =
            new SelectableList();

        this.jsonValues = this.selectableList.jsonValues;
        this.isNewSelectableList = true;
    }

    private initCategoryDataSource() {
        this.categoryDataSource.store = createStore({
            loadParams: { isDxGridData: false },
            loadUrl: this.dxDataUrlService.getLookupUrl("selectablelistcategory"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initSelectableListDataSource(): any {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("selectablelist"),
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
                    if (this.selectableListDataGrid && this.selectableListDataGrid.instance)
                        this.selectableListDataGrid.instance.refresh();
                }
            });
    }
}