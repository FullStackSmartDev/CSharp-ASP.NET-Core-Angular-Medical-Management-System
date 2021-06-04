import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { MedicalRecord } from "src/app/patientChart/models/medicalRecord";
import { AlertService } from "src/app/_services/alert.service";
import { MedicalRecordService } from "src/app/patientChart/patient-chart-tree/services/medical-record.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from 'src/app/_classes/predefinedSelectableListsNames';

@Component({
    templateUrl: "reviewed-medical-records.component.html",
    selector: "reviewed-medical-records"
})
export class ReviewedMedicalRecordsComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() companyId: string;
    @Input() patientId: string;
    @Input() isSignedOff: boolean;

    @ViewChild("medicalRecordDataGrid", { static: false }) medicalRecordDataGrid: DxDataGridComponent;
    @ViewChild("medicalRecordPopup", { static: false }) medicalRecordPopup: DxPopupComponent;
    @ViewChild("medicalRecordForm", { static: false }) medicalRecordForm: DxFormComponent;

    canRenderComponent: boolean = false;

    isMedicalRecordPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedMedicalRecord: Array<any> = [];
    medicalRecord: any = new MedicalRecord();

    isNewMedicalRecord: boolean = true;

    medicalRecordDataSource: any = {};
    icdCodesDataSource: any = {};

    constructor(private alertService: AlertService,
        private medicalRecordService: MedicalRecordService,
        private dxDataUrlService: DxDataUrlService,
        defaultValueService: DefaultValueService,
        private selectableListService: SelectableListService,
        private devextremeAuthService: DevextremeAuthService) {

        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.medicalRecord.notes = $event;
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.medicalRecordPopup);
    }

    deleteHistory(medicalRecord: MedicalRecord, $event) {
        $event.stopPropagation();
        const medicalRecordId = medicalRecord.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.medicalRecordService.delete(medicalRecordId)
                    .then(() => {
                        this.medicalRecordDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
    }

    openMedicalRecordForm() {
        this.isMedicalRecordPopupOpened = true;
    }

    onMedicalRecordPopupHidden() {
        this.isNewMedicalRecord = true;;
        this.selectedMedicalRecord = [];
        this.medicalRecord = new MedicalRecord();
    }

    createUpdateMedicalRecord() {
        const validationResult = this.medicalRecordForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewMedicalRecord)
            this.medicalRecord.patientId = this.patientId;

        this.medicalRecordService.save(this.medicalRecord)
            .then(() => {
                if (this.medicalRecordDataGrid && this.medicalRecordDataGrid.instance) {
                    this.medicalRecordDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isMedicalRecordPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onMedicalRecordSelect($event) {
        if (this.isSignedOff) {
            this.selectedMedicalRecord = [];
            return;
        }

        const selectedMedicalRecord = $event.selectedRowsData[0];
        if (!selectedMedicalRecord)
            return;

        const selectedMedicalRecordId = selectedMedicalRecord.id;

        this.medicalRecordService.getById(selectedMedicalRecordId)
            .then((medicalRecord) => {
                this.medicalRecord = medicalRecord;
                this.isMedicalRecordPopupOpened = true;
                this.isNewMedicalRecord = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    get associatedDocumentationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.associatedDocumentation)
    }

    private init(): any {
        this.initMedicalRecordDataSource();
        this.initDefaultHistoryValue("medicalrecord");
    }

    private initSelectableLists() {
        const associatedDocumentationListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.associatedDocumentation);
        const selectableLists = [associatedDocumentationListConfig];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initMedicalRecordDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("medicalRecord"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.medicalRecordDataSource.store = appointmentStore;
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
        this.medicalRecordService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}