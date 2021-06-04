import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { EducationHistory } from "src/app/patientChart/models/educationHistory";
import { AlertService } from "src/app/_services/alert.service";
import { EducationHistoryService } from "src/app/patientChart/patient-chart-tree/services/education-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";

@Component({
    templateUrl: "education-history.component.html",
    selector: "education-history"
})
export class EducationHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("educationHistoryDataGrid", { static: false }) educationHistoryDataGrid: DxDataGridComponent;
    @ViewChild("educationHistoryPopup", { static: false }) educationHistoryPopup: DxPopupComponent;
    @ViewChild("educationHistoryForm", { static: false }) educationHistoryForm: DxFormComponent;

    canRenderComponent: boolean = false;

    minCompletedYearNumber: number = 1950;
    maxCompletedYearNumber: number = new Date().getFullYear();

    isEducationHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedEducationHistory: Array<any> = [];
    educationHistory: any = new EducationHistory();

    isNewEducationHistory: boolean = true;

    educationHistoryDataSource: any = {};
    icdCodesDataSource: any = {};

    constructor(private alertService: AlertService,
        private educationHistoryService: EducationHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.educationHistory.notes = $event;
    }

    get educationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.education);
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.educationHistoryPopup);
    }

    deleteHistory(educationHistory: EducationHistory, $event) {
        $event.stopPropagation();
        const educationHistoryId = educationHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.educationHistoryService.delete(educationHistoryId)
                    .then(() => {
                        this.educationHistoryDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
        this.initDefaultHistoryValue("educationhistory");
    }

    openEducationHistoryForm() {
        this.isEducationHistoryPopupOpened = true;
    }

    onEducationHistoryPopupHidden() {
        this.isNewEducationHistory = true;;
        this.selectedEducationHistory = [];
        this.educationHistory = new EducationHistory();
    }

    createUpdateEducationHistory() {
        const validationResult = this.educationHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewEducationHistory)
            this.educationHistory.patientId = this.patientId;

        this.educationHistoryService.save(this.educationHistory)
            .then(() => {
                if (this.educationHistoryDataGrid && this.educationHistoryDataGrid.instance) {
                    this.educationHistoryDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isEducationHistoryPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onEducationHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedEducationHistory = [];
            return;
        }

        const selectedEducationHistory = $event.selectedRowsData[0];
        if (!selectedEducationHistory)
            return;

        const selectedEducationHistoryId = selectedEducationHistory.id;

        this.educationHistoryService.getById(selectedEducationHistoryId)
            .then((educationHistory) => {
                this.educationHistory = educationHistory;
                this.isEducationHistoryPopupOpened = true;
                this.isNewEducationHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initEducationHistoryDataSource();
    }

    private initSelectableLists() {
        const educationListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.education);

        const selectableLists = [educationListConfig];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initEducationHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("educationhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.educationHistoryDataSource.store = appointmentStore;
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
        this.educationHistoryService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}