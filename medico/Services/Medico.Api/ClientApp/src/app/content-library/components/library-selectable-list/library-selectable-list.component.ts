import { Component, ViewChild, OnInit } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { SelectableList } from 'src/app/_models/selectableList';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { SelectableListValue } from 'src/app/_models/selectableListValue';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { TemplateService } from 'src/app/_services/template.service';
import { LibrarySelectableListService } from 'src/app/administration/services/library/library-selectable-list.service';

@Component({
    selector: "library-selectable-list",
    templateUrl: "library-selectable-list.component.html",
})
export class LibrarySelectableListComponent extends BaseAdminComponent implements OnInit {
    @ViewChild("selectableListDataGrid", { static: false }) selectableListDataGrid: DxDataGridComponent;
    @ViewChild("selectableListPopup", { static: false }) selectableListPopup: DxPopupComponent;
    @ViewChild("selectableListForm", { static: false }) selectableListForm: DxFormComponent;

    selectableListValues: SelectableListValue[];

    selectableListDataSource: any = {};
    categoryDataSource: any = {};

    selectableList: SelectableList;
    selectedSelectableLists: Array<any> = [];

    isSelectableListPopupOpened: boolean = false;
    isNewSelectableList: boolean = true;

    constructor(private selectableListService: LibrarySelectableListService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private templateService: TemplateService) {

        super();
    }

    ngOnInit() {
        this.init();
    }

    openSelectableListForm() {
        this.isSelectableListPopupOpened = true;
    }

    onSelectableListPopupHidden() {
        this.resetSelectableListForm();
    }

    validateTitleExistence = (params) => {
        const selectableListTitle = params.value;

        this.selectableListService.getByTitle(selectableListTitle)
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
        alert("Sync with library")
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
            .getFirstBySelectableListId(selectableListId)
            .then(template => {
                return !template;
            });
    }

    private canDeactivateSelectableList(selectableListId: string): Promise<boolean> {
        return this.templateService
            .getFirstActiveBySelectableListId(selectableListId)
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
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.librarySelectableListCategory),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                }, this)
        });
    }

    private initSelectableListDataSource(): any {
        this.selectableListDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.librarySelectableList),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                }, this)
        });
    }
}