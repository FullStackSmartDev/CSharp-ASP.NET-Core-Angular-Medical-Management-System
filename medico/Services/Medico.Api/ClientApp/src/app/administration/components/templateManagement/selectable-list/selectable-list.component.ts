import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { SelectableList } from 'src/app/_models/selectableList';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { SelectableListValue } from 'src/app/_models/selectableListValue';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { TemplateService } from 'src/app/_services/template.service';

@Component({
    selector: "selectable-list",
    templateUrl: "./selectable-list.component.html"
})
export class SelectableListComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("selectableListDataGrid", { static: false }) selectableListDataGrid: DxDataGridComponent;
    @ViewChild("selectableListPopup", { static: false }) selectableListPopup: DxPopupComponent;
    @ViewChild("selectableListForm", { static: false }) selectableListForm: DxFormComponent;

    isSelectableListImportFormVisible: boolean = false;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    selectableListValues: SelectableListValue[];

    selectableListDataSource: any = {};
    categoryDataSource: any = {};

    selectableList: SelectableList;
    selectedSelectableLists: Array<any> = [];

    isSelectableListPopupOpened: boolean = false;
    isNewSelectableList: boolean = true;

    constructor(private selectableListService: SelectableListService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService,
        private templateService: TemplateService) {

        super();
    }

    ngOnDestroy() {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit() {
        this.init();
        this.subscribeToCompanyIdChanges();
    }

    onSelectableListImportApplied() {
        this.selectableListDataGrid.instance
            .getDataSource().reload();

        this.isSelectableListImportFormVisible = false;
    }

    onSelectableListImportCanceled() {
        this.isSelectableListImportFormVisible = false;
    }

    openSelectableListImportManagementPopup() {
        this.isSelectableListImportFormVisible = true;
    }

    openSelectableListForm() {
        this.isSelectableListPopupOpened = true;
    }

    onSelectableListPopupHidden() {
        this.resetSelectableListForm();
    }

    validateTitleExistence = (params) => {
        const selectableListTitle = params.value;

        this.selectableListService.getByTitle(selectableListTitle, this.companyId)
            .then(selectableList => {
                const isSelectableListTitleValid =
                    !selectableList || this.selectableList.id === selectableList.id

                params.rule.isValid = isSelectableListTitleValid;
                params.rule.message = `Selectable list with title '${selectableListTitle}' already exists`;

                params.validator.validate();
            })

        return false;
    }

    createUpdateSelectableList() {
        const validationResult = this.selectableListForm
            .instance
            .validate();

        if (!validationResult.isValid)
            return;


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
                this.selectableListValues = this.selectableList
                    .selectableListValues;

                this.isSelectableListPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    deactivateSelectableList(selectableList: SelectableList, $event) {
        $event.stopPropagation();

        const selectableListId = selectableList.id;
        this.canDeactivateSelectableList(selectableListId)
            .then(canDeactivate => {
                if (!canDeactivate) {
                    this.alertService.warning("Selectable list is used by some active templates. You cannot deactivate it.");
                    return;
                }

                this.continueDeactivatingSelectableList(selectableListId);
            });
    }

    activateSelectableList(selectableList: SelectableList, $event) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to activate the selectable list ?", "Confirm activation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListService
                    .activateDeactivateSelectableList(selectableList.id, true)
                    .then(() => {
                        this.selectableListDataGrid.instance
                            .refresh();
                    });
            }
        });
    }

    deleteSelectableList(selectableList: SelectableList, $event: any) {
        $event.stopPropagation();

        const isPredefinedSelectableList = selectableList.isPredefined;
        if (isPredefinedSelectableList) {
            this.alertService.warning("Selectab list is used in form controls. You cannot delete it.");
            return;
        }

        const selectableListId = selectableList.id;

        this.canDeleteSelectableList(selectableListId)
            .then(canDelete => {
                if (!canDelete) {
                    this.alertService.warning("Selectab list is used in templates. You cannot delete it.");
                    return;
                }

                this.continueDeletingSelectableList(selectableListId);
            });
    }

    syncWithLibrarySelectableList(selectableList: SelectableList, $event: any) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to sync selectable list ?", "Confirm sync");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListService.syncWithSelectableListTemplate(selectableList.id, selectableList.version)
                    .then(() => {
                        this.selectableListDataGrid.instance
                            .refresh();
                            
                        this.alertService.info("The selectable list was successfully synchronized");
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    private continueDeactivatingSelectableList(selectableListId: string) {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to deactivate the selectab list ?", "Confirm deactivation");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListService.activateDeactivateSelectableList(selectableListId, false)
                    .then(() => {
                        this.selectableListDataGrid.instance
                            .refresh();
                    });
            }
        });
    }

    private continueDeletingSelectableList(selectableListId: string) {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the selectab list ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.selectableListService.delete(selectableListId)
                    .then(() => {
                        this.selectableListDataGrid.instance.refresh();
                    });
            }
        });
    }

    private canDeleteSelectableList(selectableListId: string): Promise<boolean> {
        return this.templateService
            .getFirstBySelectableListId(selectableListId, this.companyId)
            .then(template => {
                return !template;
            });
    }

    private canDeactivateSelectableList(selectableListId: string): Promise<boolean> {
        return this.templateService
            .getFirstActiveBySelectableListId(selectableListId, this.companyId)
            .then(template => {
                return !template;
            });
    }

    private isSelectableListHasDefaultValue(): boolean {
        const selectableListDefaultValue = this.selectableListValues
            .filter(li => li.isDefault)[0];

        return selectableListDefaultValue ? true : false;
    }

    private resetSelectableListForm() {
        this.selectableList = new SelectableList();
        this.selectableListValues = this.selectableList.selectableListValues;
        this.isNewSelectableList = true;
        this.selectedSelectableLists = [];
    }

    private init() {
        this.initSelectableListDataSource();
        this.initCategoryDataSource();

        this.selectableList = new SelectableList();
        this.selectableListValues = this.selectableList.selectableListValues;
        this.isNewSelectableList = true;
    }

    private initCategoryDataSource() {
        this.categoryDataSource.store = createStore({
            loadParams: { isDxGridData: false },
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.selectableListCategory),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initSelectableListDataSource(): any {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.selectableList),
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