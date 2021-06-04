import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { MedicalHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { MedicalHistory } from '../../../dataModels/medicalHistory';
import CustomStore from 'devextreme/data/custom_store';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';
import { IcdCodeReadDataService } from '../../../provider/dataServices/read/IcdCodeReadDataService';

@Component({
    templateUrl: 'previousMedicalHistoryComponent.html',
    selector: 'previous-medical-history'
})

export class PreviousMedicalHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("medicalHistoryDataGrid") medicalHistoryDataGrid: DxDataGridComponent;
    @ViewChild("medicalHistoryValidationGroup") medicalHistoryValidationGroup: DxValidationGroupComponent;
    @ViewChild("icdCodeLookup") icdCodeLookup: DxLookupComponent;

    icdCodeDataSource: any = {};
    medicalHistoryDataSource: any = {};
    medicalHistory: MedicalHistory;

    isNewMedicalHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedMedicalHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private medicalHistoryDataService: MedicalHistoryDataService,
        private icdCodeReadDataService: IcdCodeReadDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [];
    }

    ngOnInit(): void {
        this.init();
    }

    diagnosisChanged($event) {
        const icdCodeId = $event.value;
        if (!icdCodeId) {
            return;
        }

        this.icdCodeReadDataService
            .getById(icdCodeId)
            .then(icdCode => {
                this.medicalHistory.Diagnosis = icdCode.Name;
                this.icdCodeLookup.instance.reset();
            });
    }

    openMedicalHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateMedicalHistoryForm();
        this.selectedMedicalHistory = [];
    }

    createUpdateMedicalHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.medicalHistory.convertToEntityModel();

        const createUpdateMedicalHistoryPromise = this.isNewMedicalHistory
            ? this.medicalHistoryDataService
                .create(this.medicalHistory)
            : this.medicalHistoryDataService
                .update(this.medicalHistory);

        createUpdateMedicalHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.medicalHistoryDataService, PatientHistoryNames.medicalHistory);

                if (this.medicalHistoryDataGrid && this.medicalHistoryDataGrid.instance) {
                    this.medicalHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateMedicalHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedMedicalHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedMedicalHistory($event) {
        if (this.isSignedOff) {
            this.selectedMedicalHistory = [];
            return;
        }

        const selectedMedicalHistory = $event.selectedRowsData[0];
        if (!selectedMedicalHistory)
            return;

        const selectedMedicalHistoryId =
            selectedMedicalHistory.Id;

        this.medicalHistoryDataService
            .getById(selectedMedicalHistoryId)
            .then((medicalHistory) => {
                this.medicalHistory = medicalHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewMedicalHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateMedicalHistoryForm() {
        this.resetValidation();
        this.isNewMedicalHistory = true;
        this.medicalHistory =
            new MedicalHistory("", false, this.patientId);
    }

    private resetValidation() {
        this.medicalHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initIcdCodeDataSource();
        this.initMedicalHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.medicalHistoryDataService, PatientHistoryNames.medicalHistory);

        this.medicalHistory = new MedicalHistory("", false, this.patientId);
    }

    private initIcdCodeDataSource() {
        this.icdCodeDataSource.store =
            this.lookupDataSourceProvider.icdCodeLookupDataSource;
    }

    private initMedicalHistoryDataSource(): any {
        this.medicalHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.medicalHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.medicalHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}