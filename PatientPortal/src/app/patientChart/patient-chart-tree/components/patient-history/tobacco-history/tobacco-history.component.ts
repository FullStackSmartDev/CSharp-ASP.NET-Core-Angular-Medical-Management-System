import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { TobaccoHistory } from "src/app/patientChart/models/tobaccoHistory";
import { AlertService } from "src/app/_services/alert.service";
import { TobaccoHistoryService } from "src/app/patientChart/patient-chart-tree/services/tobacco-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";

@Component({
    templateUrl: "tobacco-history.component.html",
    selector: "tobacco-history"
})
export class TobaccoHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("tobaccoHistoryDataGrid", { static: false }) tobaccoHistoryDataGrid: DxDataGridComponent;
    @ViewChild("tobaccoHistoryPopup", { static: false }) tobaccoHistoryPopup: DxPopupComponent;
    @ViewChild("tobaccoHistoryForm", { static: false }) tobaccoHistoryForm: DxFormComponent;

    get isDefaultHistoryValueSelected(): boolean {
        return this.tobaccoHistory.status === this.defaultHistoryValue;
    }

    canRenderComponent: boolean = false;

    isTobaccoHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedTobaccoHistory: Array<any> = [];
    tobaccoHistory: TobaccoHistory = new TobaccoHistory();
    lastCreatedTobaccoHistory: TobaccoHistory = null;

    isNewTobaccoHistory: boolean = true;
    tobaccoHistoryDataSource: any = {};

    constructor(private alertService: AlertService,
        private tobaccoHistoryService: TobaccoHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {

        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.tobaccoHistory.notes = $event;
    }

    get statusTobaccoUseListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.statusTobaccoUse);
    }

    get typeTobaccoListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.typeTobacco);
    }

    get useTobaccoListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useTobacco)
    }

    get durationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.duration)
    }

    get useFrequencyListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useFrequency)
    }

    get quit(): boolean {
        return this.tobaccoHistory.quit;
    }

    set quit(quitValue: boolean) {
        this.tobaccoHistory.quit = quitValue;

        if (!quitValue) {
            this.tobaccoHistory.statusLength = null;
            this.tobaccoHistory.statusLengthType = null;
        }
    }

    onTobaccoHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        const defaultHistoryStatus = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, PredefinedSelectableListsNames.statusTobaccoUse);

        if (dataField === "status" && fieldValue === defaultHistoryStatus) {
            this.resetTobaccoHistory();
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.tobaccoHistoryPopup);
    }

    deleteHistory(tobaccoHistory: TobaccoHistory, $event) {
        $event.stopPropagation();
        const tobaccoHistoryId = tobaccoHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.tobaccoHistoryService.delete(tobaccoHistoryId)
                    .then(() => {
                        this.setLatestTobaccoHistoryIfExists();
                        this.tobaccoHistoryDataGrid.instance.refresh();
                    });

            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setLatestTobaccoHistoryIfExists();
    }

    openTobaccoHistoryForm() {
        this.isTobaccoHistoryPopupOpened = true;
        this.copyFromLastCreatedTobaccoHistory();
    }

    onTobaccoHistoryPopupHidden() {
        this.isNewTobaccoHistory = true;;
        this.selectedTobaccoHistory = [];
        this.tobaccoHistory = new TobaccoHistory();
    }

    createUpdateTobaccoHistory() {
        const validationResult = this.tobaccoHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewTobaccoHistory)
            this.tobaccoHistory.patientId = this.patientId;

        this.tobaccoHistoryService.save(this.tobaccoHistory)
            .then(() => {
                if (this.tobaccoHistoryDataGrid && this.tobaccoHistoryDataGrid.instance) {
                    this.tobaccoHistoryDataGrid
                        .instance.refresh();
                }
                this.isHistoryExist = true;
                this.isNewTobaccoHistory = true;
                this.isTobaccoHistoryPopupOpened = false;

                this.setLatestTobaccoHistoryIfExists();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onTobaccoHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedTobaccoHistory = [];
            return;
        }

        const selectedTobaccoHistory = $event.selectedRowsData[0];
        if (!selectedTobaccoHistory)
            return;

        const selectedTobaccoHistoryId = selectedTobaccoHistory.id;

        this.tobaccoHistoryService.getById(selectedTobaccoHistoryId)
            .then((tobaccoHistory) => {
                this.tobaccoHistory = tobaccoHistory;
                this.isTobaccoHistoryPopupOpened = true;
                this.isNewTobaccoHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initTobaccoHistoryDataSource();
        this.initDefaultHistoryValue("tobaccohistory");
    }

    private initSelectableLists() {
        const statusTobaccoUseListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.statusTobaccoUse);
        const typeTobaccoListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.typeTobacco);
        const useTobaccoListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useTobacco);
        const durationListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.duration);
        const useFrequencyListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useFrequency);

        const selectableLists = [
            statusTobaccoUseListConfig,
            typeTobaccoListConfig,
            useTobaccoListConfig,
            durationListConfig,
            useFrequencyListConfig
        ];

        this.selectableListService.setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private copyFromLastCreatedTobaccoHistory() {
        if (this.lastCreatedTobaccoHistory) {
            this.tobaccoHistory.type = this.lastCreatedTobaccoHistory.type;
            this.tobaccoHistory.status = this.lastCreatedTobaccoHistory.status;
            this.tobaccoHistory.amount = this.lastCreatedTobaccoHistory.amount;
            this.tobaccoHistory.use = this.lastCreatedTobaccoHistory.use;
            this.tobaccoHistory.frequency = this.lastCreatedTobaccoHistory.frequency;
            this.tobaccoHistory.length = this.lastCreatedTobaccoHistory.length;
            this.tobaccoHistory.duration = this.lastCreatedTobaccoHistory.duration;
            this.tobaccoHistory.quit = this.lastCreatedTobaccoHistory.quit;
            this.tobaccoHistory.statusLength = this.lastCreatedTobaccoHistory.statusLength;
            this.tobaccoHistory.statusLengthType = this.lastCreatedTobaccoHistory.statusLengthType;
            this.tobaccoHistory.notes = this.lastCreatedTobaccoHistory.notes;
        }
    }

    private resetTobaccoHistory() {
        this.tobaccoHistory.type = null;
        this.tobaccoHistory.amount = null;
        this.tobaccoHistory.use = null;
        this.tobaccoHistory.frequency = null;
        this.tobaccoHistory.length = null;
        this.tobaccoHistory.duration = null;
        this.tobaccoHistory.quit = false;
        this.tobaccoHistory.statusLength = null;
        this.tobaccoHistory.statusLengthType = null;
    }

    private setLatestTobaccoHistoryIfExists() {
        this.tobaccoHistoryService.getLastCreated(this.patientId)
            .then(tobaccoHistory => {
                this.lastCreatedTobaccoHistory = tobaccoHistory
                    ? tobaccoHistory
                    : new TobaccoHistory();

                this.isHistoryExist = !!tobaccoHistory;
            });
    }

    private initTobaccoHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("tobaccohistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.tobaccoHistoryDataSource.store = appointmentStore;
        this.applyDecoratorForDataSourceLoadFunc(appointmentStore)
    }

    private applyDecoratorForDataSourceLoadFunc(store: any) {
        const nativeLoadFunc = store.load;
        store.load = loadOptions => {
            return nativeLoadFunc.call(store, loadOptions)
                .then(result => {
                    result.forEach(item => {
                        item.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.createDate);
                    });
                    return result;
                });
        };
    }
}