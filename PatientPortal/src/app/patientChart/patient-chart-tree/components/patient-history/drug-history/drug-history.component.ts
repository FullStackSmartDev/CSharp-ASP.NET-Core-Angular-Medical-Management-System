import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { DrugHistory } from "src/app/patientChart/models/drugHistory";
import { AlertService } from "src/app/_services/alert.service";
import { DrugHistoryService } from "src/app/patientChart/patient-chart-tree/services/drug-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";

@Component({
    templateUrl: "drug-history.component.html",
    selector: "drug-history"
})
export class DrugHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("drugHistoryDataGrid", { static: false }) drugHistoryDataGrid: DxDataGridComponent;
    @ViewChild("drugHistoryPopup", { static: false }) drugHistoryPopup: DxPopupComponent;
    @ViewChild("drugHistoryForm", { static: false }) drugHistoryForm: DxFormComponent;

    get isDefaultHistoryValueSelected(): boolean {
        return this.drugHistory.status === this.defaultHistoryValue;
    }

    canRenderComponent: boolean = false;

    isDrugHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedDrugHistory: Array<any> = [];
    drugHistory: DrugHistory = new DrugHistory();
    lastCreatedDrugHistory: DrugHistory = null;

    isNewDrugHistory: boolean = true;
    drugHistoryDataSource: any = {};

    constructor(private alertService: AlertService,
        private drugHistoryService: DrugHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.drugHistory.notes = $event;
    }

    get statusDrugUseListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.statusDrugUse);
    }

    get typeDrugListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.typeDrugs);
    }

    get useDrugListValues(): string[] {
        return this.selectableListService.
            getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useDrug);
    }

    get durationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.duration);
    }

    get useFrequencyListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useFrequency);
    }

    get useDrugRouteListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useDrugRoute);
    }

    get quit(): boolean {
        return this.drugHistory.quit;
    }

    set quit(quitValue: boolean) {
        this.drugHistory.quit = quitValue;

        if (!quitValue) {
            this.drugHistory.statusLength = null;
            this.drugHistory.statusLengthType = null;
        }
    }

    onDrugHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        const defaultHistoryStatus = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, PredefinedSelectableListsNames.statusDrugUse);

        if (dataField === "status" && fieldValue === defaultHistoryStatus) {
            this.resetDrugHistory();
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.drugHistoryPopup);
    }

    deleteHistory(drugHistory: DrugHistory, $event) {
        $event.stopPropagation();
        const drugHistoryId = drugHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.drugHistoryService.delete(drugHistoryId)
                    .then(() => {
                        this.setLatestDrugHistoryIfExists();
                        this.drugHistoryDataGrid.instance.refresh();
                    });

            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setLatestDrugHistoryIfExists();
    }

    openDrugHistoryForm() {
        this.isDrugHistoryPopupOpened = true;
        this.copyFromLastCreatedDrugHistory();
    }

    onDrugHistoryPopupHidden() {
        this.isNewDrugHistory = true;;
        this.selectedDrugHistory = [];
        this.drugHistory = new DrugHistory();
    }

    createUpdateDrugHistory() {
        const validationResult = this.drugHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewDrugHistory)
            this.drugHistory.patientId = this.patientId;

        this.drugHistoryService.save(this.drugHistory)
            .then(() => {
                if (this.drugHistoryDataGrid && this.drugHistoryDataGrid.instance) {
                    this.drugHistoryDataGrid
                        .instance.refresh();
                }
                this.isHistoryExist = true;
                this.isNewDrugHistory = true;
                this.isDrugHistoryPopupOpened = false;

                this.setLatestDrugHistoryIfExists();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onDrugHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedDrugHistory = [];
            return;
        }

        const selectedDrugHistory = $event.selectedRowsData[0];
        if (!selectedDrugHistory)
            return;

        const selectedDrugHistoryId = selectedDrugHistory.id;

        this.drugHistoryService.getById(selectedDrugHistoryId)
            .then((drugHistory) => {
                this.drugHistory = drugHistory;
                this.isDrugHistoryPopupOpened = true;
                this.isNewDrugHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initDrugHistoryDataSource();
        this.initDefaultHistoryValue("drughistory");
    }

    private initSelectableLists() {
        const statusDrugUseListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.statusDrugUse);
        const typeDrugListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.typeDrugs);
        const useDrugListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useDrug);
        const durationListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.duration);
        const useFrequencyListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useFrequency);
        const useDrugRouteListConfig = new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useDrugRoute);

        const selectableLists = [
            statusDrugUseListConfig,
            typeDrugListConfig,
            useDrugListConfig,
            durationListConfig,
            useFrequencyListConfig,
            useDrugRouteListConfig
        ];

        this.selectableListService.setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private copyFromLastCreatedDrugHistory() {
        if (this.lastCreatedDrugHistory) {
            this.drugHistory.type = this.lastCreatedDrugHistory.type;
            this.drugHistory.route = this.lastCreatedDrugHistory.route;
            this.drugHistory.status = this.lastCreatedDrugHistory.status;
            this.drugHistory.amount = this.lastCreatedDrugHistory.amount;
            this.drugHistory.use = this.lastCreatedDrugHistory.use;
            this.drugHistory.frequency = this.lastCreatedDrugHistory.frequency;
            this.drugHistory.length = this.lastCreatedDrugHistory.length;
            this.drugHistory.duration = this.lastCreatedDrugHistory.duration;
            this.drugHistory.quit = this.lastCreatedDrugHistory.quit;
            this.drugHistory.statusLength = this.lastCreatedDrugHistory.statusLength;
            this.drugHistory.statusLengthType = this.lastCreatedDrugHistory.statusLengthType;
            this.drugHistory.notes = this.lastCreatedDrugHistory.notes;
        }
    }

    private resetDrugHistory() {
        this.drugHistory.type = null;
        this.drugHistory.amount = null;
        this.drugHistory.use = null;
        this.drugHistory.frequency = null;
        this.drugHistory.length = null;
        this.drugHistory.duration = null;
        this.drugHistory.quit = false;
        this.drugHistory.statusLength = null;
        this.drugHistory.statusLengthType = null;
        this.drugHistory.route = null;
    }

    private setLatestDrugHistoryIfExists() {
        this.drugHistoryService.getLastCreated(this.patientId)
            .then(drugHistory => {
                this.lastCreatedDrugHistory = drugHistory
                    ? drugHistory
                    : new DrugHistory();

                this.isHistoryExist = !!drugHistory;
            });
    }

    private initDrugHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("drughistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.drugHistoryDataSource.store = appointmentStore;
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