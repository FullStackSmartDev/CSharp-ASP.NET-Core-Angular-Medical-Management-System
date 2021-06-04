import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { BaseHistoryComponent } from '../base-history.component';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { SurgicalHistory } from 'src/app/patientChart/models/surgicalHistory';
import { AlertService } from 'src/app/_services/alert.service';
import { SurgicalHistoryService } from 'src/app/patientChart/patient-chart-tree/services/surgical-history.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { CptCodeService } from 'src/app/_services/cpt-code.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    templateUrl: 'surgical-history.component.html',
    selector: 'surgical-history'
})
export class SurgicalHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input("patientId") patientId: string;
    @Input("isSignedOff") isSignedOff: boolean;
    @Input("companyId") companyId: boolean;

    @ViewChild("surgicalHistoryDataGrid", { static: false }) surgicalHistoryDataGrid: DxDataGridComponent;
    @ViewChild("surgicalHistoryPopup", { static: false }) surgicalHistoryPopup: DxPopupComponent;
    @ViewChild("surgicalHistoryForm", { static: false }) surgicalHistoryForm: DxFormComponent;

    isSurgicalHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedSurgicalHistory: Array<any> = [];
    surgicalHistory: any = new SurgicalHistory();

    isNewSurgicalHistory: boolean = true;
    surgicalHistoryDataSource: any = {};

    icdCodesDataSource: any = {};

    constructor(private alertService: AlertService,
        private surgicalHistoryService: SurgicalHistoryService,
        private dxDataUrlService: DxDataUrlService,
        private cptCodeService: CptCodeService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.surgicalHistory.notes = $event;
    }

    onSurgicalHistoryFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "cptCode" && fieldValue) {
            this.cptCodeService.getById(fieldValue)
                .then(cptCode => {
                    this.surgicalHistory.diagnosis = cptCode.description;
                    this.surgicalHistory.cptCode = "";
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.surgicalHistoryPopup);
    }

    deleteHistory(surgicalHistory: SurgicalHistory, $event) {
        $event.stopPropagation();
        const surgicalHistoryId = surgicalHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.surgicalHistoryService.delete(surgicalHistoryId)
                    .then(() => {
                        this.surgicalHistoryDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.setHistoryExistence();
    }

    openSurgicalHistoryForm() {
        this.isSurgicalHistoryPopupOpened = true;
    }

    onSurgicalHistoryPopupHidden() {
        this.isNewSurgicalHistory = true;;
        this.selectedSurgicalHistory = [];
        this.surgicalHistory = new SurgicalHistory();
    }

    createUpdateSurgicalHistory() {
        const validationResult = this.surgicalHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.surgicalHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(this.surgicalHistory.createDate);

        if (this.isNewSurgicalHistory)
            this.surgicalHistory.patientId = this.patientId;

        this.surgicalHistoryService.save(this.surgicalHistory)
            .then(() => {
                if (this.surgicalHistoryDataGrid && this.surgicalHistoryDataGrid.instance) {
                    this.surgicalHistoryDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isSurgicalHistoryPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onSurgicalHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedSurgicalHistory = [];
            return;
        }

        const selectedSurgicalHistory = $event.selectedRowsData[0];
        if (!selectedSurgicalHistory)
            return;

        const selectedSurgicalHistoryId = selectedSurgicalHistory.id;

        this.surgicalHistoryService.getById(selectedSurgicalHistoryId)
            .then((surgicalHistory) => {
                this.surgicalHistory = surgicalHistory;
                this.isSurgicalHistoryPopupOpened = true;
                this.isNewSurgicalHistory = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initSurgicalHistoryDataSource();
        this.initCptCodeDataSource();
        this.initDefaultHistoryValue("previoussurgicalhistory");
    }

    private setHistoryExistence() {
        this.surgicalHistoryService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initSurgicalHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("surgicalhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.surgicalHistoryDataSource.store = appointmentStore;
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

    private initCptCodeDataSource(): void {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("cptcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}