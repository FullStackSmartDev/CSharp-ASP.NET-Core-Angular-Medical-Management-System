import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { AlertService } from '../../../provider/alertService';
import { MedicationHistory } from '../../../dataModels/medicationHistory';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { MedicationHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import CustomStore from 'devextreme/data/custom_store';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';
import { MedicationReadDataService } from '../../../provider/dataServices/read/medicationReadDataService';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';

@Component({
    templateUrl: 'medicationHistoryComponent.html',
    selector: 'medication-history'
})

export class MedicationHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("medicationHistoryDataGrid") medicationHistoryDataGrid: DxDataGridComponent;
    @ViewChild("medicationHistoryValidationGroup") medicationHistoryValidationGroup: DxValidationGroupComponent;

    @ViewChild("medicationLookup") medicationLookup: DxLookupComponent;

    medicationHistoryDataSource: any = {};
    medicationDataSource: any = {};

    medicationHistory: MedicationHistory;

    isNewMedicationHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedMedicationHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        private medicationReadDataService: MedicationReadDataService,
        alertService: AlertService,
        private medicationHistoryDataService: MedicationHistoryDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return ["mED_Units", "mED_Route", "mED_DoseSchedule", "mED_Status"];
    }

    ngOnInit(): void {
        this.init();
    }

    openMedicationHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateMedicationHistoryForm();
        this.selectedMedicationHistory = [];
    }

    createUpdateMedicationHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.medicationHistory.convertToEntityModel();

        const createUpdateMedicationHistoryPromise = this.isNewMedicationHistory
            ? this.medicationHistoryDataService
                .create(this.medicationHistory)
            : this.medicationHistoryDataService
                .update(this.medicationHistory);

        createUpdateMedicationHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.medicationHistoryDataService, PatientHistoryNames.medicationsHistory);

                if (this.medicationHistoryDataGrid && this.medicationHistoryDataGrid.instance) {
                    this.medicationHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateMedicationHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedMedicationHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error")
            });
    }

    medicationChanged($event) {
        const medicationId = $event.value;
        if (!medicationId) {
            return;
        }

        this.medicationReadDataService
            .getById(medicationId)
            .then(medication => {
                this.medicationHistory.Medication = medication.NonProprietaryName;
                this.medicationLookup.instance.reset();
            });
    }

    onSelectedMedicationHistory($event) {
        if (this.isSignedOff) {
            this.selectedMedicationHistory = [];
            return;
        }

        const selectedMedicationHistory = $event.selectedRowsData[0];
        if (!selectedMedicationHistory)
            return;

        const selectedMedicationHistoryId =
            selectedMedicationHistory.Id;

        this.medicationHistoryDataService
            .getById(selectedMedicationHistoryId)
            .then((medicationHistory) => {
                this.medicationHistory = medicationHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewMedicationHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateMedicationHistoryForm() {
        this.resetValidation();
        this.isNewMedicationHistory = true;
        this.medicationHistory =
            new MedicationHistory("", false, this.patientId);
    }

    private resetValidation() {
        this.medicationHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initMedicationDataSource();
        this.initMedicationHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.medicationHistoryDataService, PatientHistoryNames.medicationsHistory);

        this.medicationHistory =
            new MedicationHistory("", false, this.patientId);
    }

    private initMedicationDataSource() {
        this.medicationDataSource.store = this.lookupDataSourceProvider
            .medicationLookupDataSource;
    }

    private initMedicationHistoryDataSource(): any {
        this.medicationHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.medicationHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.medicationHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}