import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { OccupationalHistory } from "src/app/patientChart/models/occupationalHistory";
import { AlertService } from "src/app/_services/alert.service";
import { OccupationalHistoryService } from "src/app/patientChart/patient-chart-tree/services/occupational-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";
import { DxiItemComponent } from 'devextreme-angular/ui/nested/item-dxi';

@Component({
    templateUrl: "occupational-history.component.html",
    selector: "occupational-history"
})
export class OccupationalHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("occupationalHistoryDataGrid", { static: false }) occupationalHistoryDataGrid: DxDataGridComponent;
    @ViewChild("occupationalHistoryPopup", { static: false }) occupationalHistoryPopup: DxPopupComponent;
    @ViewChild("occupationalHistoryForm", { static: false }) occupationalHistoryForm: DxFormComponent;

    currentDate = new Date();
    minOccupationalDate = new Date(1900, 1, 1);

    canRenderComponent: boolean = false;

    isOccupationalHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedOccupationalHistory: Array<any> = [];
    occupationalHistory: any = new OccupationalHistory();

    isNewOccupationalHistory: boolean = true;

    occupationalHistoryDataSource: any = {};
    icdCodesDataSource: any = {};

    constructor(private alertService: AlertService,
        private occupationalHistoryService: OccupationalHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onStartDateBoxFocusOut() {
        this.occupationalHistoryForm
            .instance.validate();
    }

    onEndDateBoxFocusOut() {
        this.occupationalHistoryForm
            .instance.validate();
    }

    validateStartDate = (params) => {
        const startDate = params.value;
        if (!startDate)
            return true;

        const endDate = this.occupationalHistory.end;
        if (!endDate)
            return true;

        return startDate < endDate;
    }

    validateEndDate = (params) => {
        const endDate = params.value;
        if (!endDate)
            return true;

        const startDate = this.occupationalHistory.start;
        if (!startDate)
            return true;

        return startDate < endDate;
    }

    onPhraseSuggestionApplied($event) {
        this.occupationalHistory.notes = $event;
    }

    get occupationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.occupation)
    }

    get employmentStatusListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.employmentStatus)
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.occupationalHistoryPopup);
    }

    deleteHistory(occupationalHistory: OccupationalHistory, $event) {
        $event.stopPropagation();
        const occupationalHistoryId = occupationalHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.occupationalHistoryService.delete(occupationalHistoryId)
                    .then(() => {
                        this.occupationalHistoryDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });

            }
        });
    }

    onOccupationalHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "hasDisabilityClaim" && !fieldValue) {
            this.occupationalHistory.disabilityClaimDetails = null;
        }

        if (dataField === "hasWorkersCompensationClaim" && !fieldValue) {
            this.occupationalHistory.workersCompensationClaimDetails = null;
        }
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
    }

    openOccupationalHistoryForm() {
        this.isOccupationalHistoryPopupOpened = true;
    }

    onOccupationalHistoryPopupHidden() {
        this.isNewOccupationalHistory = true;;
        this.selectedOccupationalHistory = [];
        this.occupationalHistory = new OccupationalHistory();

        this.occupationalHistory.hasDisabilityClaim = false;
        this.occupationalHistory.hasWorkersCompensationClaim = false;
    }

    createUpdateOccupationalHistory() {
        const validationResult = this.occupationalHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewOccupationalHistory)
            this.occupationalHistory.patientId = this.patientId;

        this.occupationalHistoryService.save(this.occupationalHistory)
            .then(() => {
                if (this.occupationalHistoryDataGrid && this.occupationalHistoryDataGrid.instance) {
                    this.occupationalHistoryDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isOccupationalHistoryPopupOpened = false;

            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    getOccupationalDays(gridItem) {
        const startDate = new Date(gridItem.start);
        const endDate = gridItem.end
            ? new Date(gridItem.end)
            : new Date();

        return DateHelper
            .getDaysBetween(startDate, endDate);
    }

    onOccupationalHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedOccupationalHistory = [];
            return;
        }

        const selectedOccupationalHistory = $event.selectedRowsData[0];
        if (!selectedOccupationalHistory)
            return;

        const selectedOccupationalHistoryId = selectedOccupationalHistory.id;

        this.occupationalHistoryService.getById(selectedOccupationalHistoryId)
            .then((occupationalHistory) => {
                this.occupationalHistory = occupationalHistory;

                this.occupationalHistory.hasDisabilityClaim =
                    !!this.occupationalHistory.disabilityClaimDetails;

                this.occupationalHistory.hasWorkersCompensationClaim =
                    !!this.occupationalHistory.workersCompensationClaimDetails;

                this.isOccupationalHistoryPopupOpened = true;
                this.isNewOccupationalHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initOccupationalHistoryDataSource();
        this.initDefaultHistoryValue("occupationalhistory");

        this.occupationalHistory.hasDisabilityClaim = false;
        this.occupationalHistory.hasWorkersCompensationClaim = false;
    }

    private initSelectableLists() {
        const occupationListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.occupation);
        const employmentStatusListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.employmentStatus);

        const selectableLists = [
            employmentStatusListConfig,
            occupationListConfig
        ];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initOccupationalHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("occupationalhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.occupationalHistoryDataSource.store = appointmentStore;
        this.applyDecoratorForDataSourceLoadFunc(appointmentStore)
    }

    private applyDecoratorForDataSourceLoadFunc(store: any) {
        const nativeLoadFunc = store.load;
        store.load = loadOptions => {
            return nativeLoadFunc.call(store, loadOptions)
                .then(result => {
                    result.forEach(item => {
                        item.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.createDate);
                        item.start = DateHelper.sqlServerUtcDateToLocalJsDate(item.start);

                        if (item.end)
                            item.end = DateHelper.sqlServerUtcDateToLocalJsDate(item.end);
                    });
                    return result;
                });
        };
    }

    private setHistoryExistence() {
        this.occupationalHistoryService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}