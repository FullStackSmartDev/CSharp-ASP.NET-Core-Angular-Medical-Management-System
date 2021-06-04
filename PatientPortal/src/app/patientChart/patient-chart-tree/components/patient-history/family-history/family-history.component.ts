import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { FamilyHistory } from "src/app/patientChart/models/familyHistory";
import { AlertService } from "src/app/_services/alert.service";
import { FamilyHistoryService } from "src/app/patientChart/patient-chart-tree/services/family-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { IcdCodeService } from "src/app/_services/icd-code.service";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from 'src/app/_classes/predefinedSelectableListsNames';

@Component({
    templateUrl: "family-history.component.html",
    selector: "family-history"
})
export class FamilyHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("familyHistoryDataGrid", { static: false }) familyHistoryDataGrid: DxDataGridComponent;
    @ViewChild("familyHistoryPopup", { static: false }) familyHistoryPopup: DxPopupComponent;
    @ViewChild("familyHistoryForm", { static: false }) familyHistoryForm: DxFormComponent;

    canRenderComponent: boolean = false;

    isFamilyHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedFamilyHistory: Array<any> = [];
    familyHistory: any = new FamilyHistory();

    isNewFamilyHistory: boolean = true;

    familyHistoryDataSource: any = {};
    icdCodesDataSource: any = {};

    constructor(private alertService: AlertService,
        private familyHistoryService: FamilyHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private icdCodeService: IcdCodeService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.familyHistory.notes = $event;
    }

    get familyListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.family)
    }

    get familyStatusListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.familyStatus)
    }

    onFamilyHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "icdCode" && fieldValue) {
            this.icdCodeService.getById(fieldValue)
                .then(icdCode => {
                    this.familyHistory.diagnosis = icdCode.name;
                    this.familyHistory.icdCode = "";
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.familyHistoryPopup);
    }

    deleteHistory(familyHistory: FamilyHistory, $event) {
        $event.stopPropagation();
        const familyHistoryId = familyHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.familyHistoryService.delete(familyHistoryId)
                    .then(() => {
                        this.familyHistoryDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
        this.initDefaultHistoryValue("familyhistory");
    }

    openFamilyHistoryForm() {
        this.isFamilyHistoryPopupOpened = true;
    }

    onFamilyHistoryPopupHidden() {
        this.isNewFamilyHistory = true;;
        this.selectedFamilyHistory = [];
        this.familyHistory = new FamilyHistory();
    }

    createUpdateFamilyHistory() {
        const validationResult = this.familyHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewFamilyHistory)
            this.familyHistory.patientId = this.patientId;

        this.familyHistoryService.save(this.familyHistory)
            .then(() => {
                if (this.familyHistoryDataGrid && this.familyHistoryDataGrid.instance) {
                    this.familyHistoryDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isFamilyHistoryPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onFamilyHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedFamilyHistory = [];
            return;
        }

        const selectedFamilyHistory = $event.selectedRowsData[0];
        if (!selectedFamilyHistory)
            return;

        const selectedFamilyHistoryId = selectedFamilyHistory.id;

        this.familyHistoryService.getById(selectedFamilyHistoryId)
            .then((familyHistory) => {
                this.familyHistory = familyHistory;
                this.isFamilyHistoryPopupOpened = true;
                this.isNewFamilyHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initFamilyHistoryDataSource();
        this.initIcdCodeDataSource();
    }

    private initSelectableLists() {
        const familyListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.family);
        const familyStatusListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.familyStatus);

        const selectableLists = [
            familyStatusListConfig,
            familyListConfig
        ];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initFamilyHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("familyhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.familyHistoryDataSource.store = appointmentStore;
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

    private setHistoryExistence() {
        this.familyHistoryService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initIcdCodeDataSource(): void {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("icdcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}