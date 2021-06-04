import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { AlcoholHistory } from "src/app/patientChart/models/alcoholHistory";
import { AlertService } from "src/app/_services/alert.service";
import { AlcoholHistoryService } from "src/app/patientChart/patient-chart-tree/services/alcohol-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";

@Component({
    templateUrl: "alcohol-history.component.html",
    selector: "alcohol-history"
})
export class AlcoholHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("alcoholHistoryDataGrid", { static: false }) alcoholHistoryDataGrid: DxDataGridComponent;
    @ViewChild("alcoholHistoryPopup", { static: false }) alcoholHistoryPopup: DxPopupComponent;
    @ViewChild("alcoholHistoryForm", { static: false }) alcoholHistoryForm: DxFormComponent;

    get isDefaultHistoryValueSelected(): boolean {
        return this.alcoholHistory.status === this.defaultHistoryValue;
    }

    canRenderComponent: boolean = false;

    isAlcoholHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedAlcoholHistory: Array<any> = [];
    alcoholHistory: AlcoholHistory = new AlcoholHistory();
    lastCreatedAlcoholHistory: AlcoholHistory = null;

    isNewAlcoholHistory: boolean = true;
    alcoholHistoryDataSource: any = {};

    constructor(private alertService: AlertService,
        private alcoholHistoryService: AlcoholHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.alcoholHistory.notes = $event;
    }

    get statusEtohUseListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.statusEtohUse);
    }

    get typeAlcoholListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.typeEtoh);
    }

    get useAlcoholListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useAlcohol);
    }

    get durationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.duration);
    }

    get useFrequencyListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.useFrequency)
    }

    get quit(): boolean {
        return this.alcoholHistory.quit;
    }

    set quit(quitValue: boolean) {
        this.alcoholHistory.quit = quitValue;

        if (!quitValue) {
            this.alcoholHistory.statusLength = null;
            this.alcoholHistory.statusLengthType = null;
        }
    }

    onAlcoholHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        const defaultHistoryStatus = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, PredefinedSelectableListsNames.statusEtohUse);

        if (dataField === "status" && fieldValue === defaultHistoryStatus) {
            this.resetAlcoholHistory();
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.alcoholHistoryPopup);
    }

    deleteHistory(alcoholHistory: AlcoholHistory, $event) {
        $event.stopPropagation();
        const alcoholHistoryId = alcoholHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.alcoholHistoryService.delete(alcoholHistoryId)
                    .then(() => {
                        this.setLatestAlcoholHistoryIfExists();
                        this.alcoholHistoryDataGrid.instance.refresh();
                    });

            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setLatestAlcoholHistoryIfExists();
    }

    openAlcoholHistoryForm() {
        this.isAlcoholHistoryPopupOpened = true;
        this.copyFromLastCreatedAlcoholHistory();
    }

    onAlcoholHistoryPopupHidden() {
        this.isNewAlcoholHistory = true;;
        this.selectedAlcoholHistory = [];
        this.alcoholHistory = new AlcoholHistory();
    }

    createUpdateAlcoholHistory() {
        const validationResult = this.alcoholHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewAlcoholHistory)
            this.alcoholHistory.patientId = this.patientId;

        this.alcoholHistoryService.save(this.alcoholHistory)
            .then(() => {
                if (this.alcoholHistoryDataGrid && this.alcoholHistoryDataGrid.instance) {
                    this.alcoholHistoryDataGrid
                        .instance.refresh();
                }
                this.isHistoryExist = true;
                this.isNewAlcoholHistory = true;
                this.isAlcoholHistoryPopupOpened = false;

                this.setLatestAlcoholHistoryIfExists();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onAlcoholHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedAlcoholHistory = [];
            return;
        }

        const selectedAlcoholHistory = $event.selectedRowsData[0];
        if (!selectedAlcoholHistory)
            return;

        const selectedAlcoholHistoryId = selectedAlcoholHistory.id;

        this.alcoholHistoryService.getById(selectedAlcoholHistoryId)
            .then((alcoholHistory) => {
                this.alcoholHistory = alcoholHistory;
                this.isAlcoholHistoryPopupOpened = true;
                this.isNewAlcoholHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initAlcoholHistoryDataSource();
        this.initDefaultHistoryValue("alcoholhistory");
    }

    private initSelectableLists() {
        const statusAlcoholUseListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.statusEtohUse);

        const typeAlcoholListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.typeEtoh);

        const useAlcoholListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useAlcohol);

        const durationListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.duration);

        const useFrequencyListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.useFrequency);

        const selectableLists = [
            statusAlcoholUseListConfig,
            typeAlcoholListConfig,
            useAlcoholListConfig,
            durationListConfig,
            useFrequencyListConfig
        ];

        this.selectableListService.setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private copyFromLastCreatedAlcoholHistory() {
        if (this.lastCreatedAlcoholHistory) {
            this.alcoholHistory.type = this.lastCreatedAlcoholHistory.type;
            this.alcoholHistory.status = this.lastCreatedAlcoholHistory.status;
            this.alcoholHistory.amount = this.lastCreatedAlcoholHistory.amount;
            this.alcoholHistory.use = this.lastCreatedAlcoholHistory.use;
            this.alcoholHistory.frequency = this.lastCreatedAlcoholHistory.frequency;
            this.alcoholHistory.length = this.lastCreatedAlcoholHistory.length;
            this.alcoholHistory.duration = this.lastCreatedAlcoholHistory.duration;
            this.alcoholHistory.quit = this.lastCreatedAlcoholHistory.quit;
            this.alcoholHistory.statusLength = this.lastCreatedAlcoholHistory.statusLength;
            this.alcoholHistory.statusLengthType = this.lastCreatedAlcoholHistory.statusLengthType;
            this.alcoholHistory.notes = this.lastCreatedAlcoholHistory.notes;
        }
    }

    private resetAlcoholHistory() {
        this.alcoholHistory.type = null;
        this.alcoholHistory.amount = null;
        this.alcoholHistory.use = null;
        this.alcoholHistory.frequency = null;
        this.alcoholHistory.length = null;
        this.alcoholHistory.duration = null;
        this.alcoholHistory.quit = false;
        this.alcoholHistory.statusLength = null;
        this.alcoholHistory.statusLengthType = null;
    }

    private setLatestAlcoholHistoryIfExists() {
        this.alcoholHistoryService.getLastCreated(this.patientId)
            .then(alcoholHistory => {
                this.lastCreatedAlcoholHistory = alcoholHistory
                    ? alcoholHistory
                    : new AlcoholHistory();

                this.isHistoryExist = !!alcoholHistory;
            });
    }

    private initAlcoholHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("alcoholhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.alcoholHistoryDataSource.store = appointmentStore;
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