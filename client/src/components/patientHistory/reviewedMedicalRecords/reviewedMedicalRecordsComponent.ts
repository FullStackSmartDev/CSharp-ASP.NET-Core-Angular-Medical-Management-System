import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { MedicalRecordDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { MedicalRecord } from '../../../dataModels/medicalRecord';
import CustomStore from 'devextreme/data/custom_store';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'reviewedMedicalRecordsComponent.html',
    selector: 'reviewed-medical-records'
})
export class ReviewedMedicalRecordsComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("medicalRecordDataGrid") medicalRecordDataGrid: DxDataGridComponent;
    @ViewChild("medicalRecordValidationGroup") medicalRecordValidationGroup: DxValidationGroupComponent;

    icdCodeDataSource: any = {};
    medicalRecordDataSource: any = {};
    medicalRecord: MedicalRecord;

    isNewMedicalRecord: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedMedicalRecord: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private medicalRecordDataService: MedicalRecordDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [];
    }

    ngOnInit(): void {
        this.init();
    }

    openMedicalRecordCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateMedicalRecordForm();
        this.selectedMedicalRecord = [];
    }

    createUpdateMedicalRecord($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.medicalRecord.convertToEntityModel();

        const createUpdateMedicalRecordPromise = this.isNewMedicalRecord
            ? this.medicalRecordDataService
                .create(this.medicalRecord)
            : this.medicalRecordDataService
                .update(this.medicalRecord);

        createUpdateMedicalRecordPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.medicalRecordDataService, PatientHistoryNames.medicalRecord);

                if (this.medicalRecordDataGrid && this.medicalRecordDataGrid.instance) {
                    this.medicalRecordDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateMedicalRecordForm();
                this.loadPanelService.hideLoader();
                this.selectedMedicalRecord = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedMedicalRecord($event) {
        if (this.isSignedOff) {
            this.selectedMedicalRecord = [];
            return;
        }

        const selectedMedicalRecord = $event.selectedRowsData[0];
        if (!selectedMedicalRecord)
            return;

        const selectedMedicalRecordId =
            selectedMedicalRecord.Id;

        this.medicalRecordDataService
            .getById(selectedMedicalRecordId)
            .then((medicalRecord) => {
                this.medicalRecord = medicalRecord;
                this.isCreateUpdatePopupOpened = true;
                this.isNewMedicalRecord = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateMedicalRecordForm() {
        this.resetValidation();
        this.isNewMedicalRecord = true;
        this.medicalRecord =
            new MedicalRecord("", false, this.patientId);
    }

    private resetValidation() {
        this.medicalRecordValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initMedicalRecordDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.medicalRecordDataService, PatientHistoryNames.medicalRecord);

        this.medicalRecord = new MedicalRecord("", false, this.patientId);
    }

    private initMedicalRecordDataSource(): any {
        const self = this;
        this.medicalRecordDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.medicalRecordDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return self.medicalRecordDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}