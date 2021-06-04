import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { Allergy } from '../../../dataModels/allergy';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { AllergyDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import CustomStore from 'devextreme/data/custom_store';
import { PatientDataModelTrackService } from '../../../provider/patientDataModelTrackService';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';
import { MedicationReadDataService } from '../../../provider/dataServices/read/medicationReadDataService';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';

@Component({
    templateUrl: 'allergyComponent.html',
    selector: 'allergy'
})

export class AllergyComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("allergyDataGrid") allergyDataGrid: DxDataGridComponent;
    @ViewChild("allergyValidationGroup") allergyValidationGroup: DxValidationGroupComponent;

    @ViewChild("medicationLookup") medicationLookup: DxLookupComponent;

    allergyDataSource: any = {};
    medicationDataSource: any = {};

    allergy: Allergy;

    isNewAllergy: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedAllergy: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private allergyDataService: AllergyDataService,
        private medicationReadDataService: MedicationReadDataService,
        toastService: ToastService, lookupItemsAppService: LookupItemsAppService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return ["mED_Allergy"];
    }

    ngOnInit(): void {
        this.init();
    }

    openAllergyCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateAllergyForm();
        this.selectedAllergy = [];
    }

    createUpdateAllergy($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.allergy.convertToEntityModel();

        const createUpdateAllergyPromise = this.isNewAllergy
            ? this.allergyDataService
                .create(this.allergy)
            : this.allergyDataService
                .update(this.allergy);

        createUpdateAllergyPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.allergyDataService, PatientHistoryNames.allergiesHistory);

                if (this.allergyDataGrid && this.allergyDataGrid.instance) {
                    this.allergyDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateAllergyForm();

                this.patientDataModelTrackService
                    .emitPatientDataModelChanges(true);

                this.loadPanelService.hideLoader();
                this.selectedAllergy = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
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
                this.allergy.Medication = medication.NonProprietaryName;
                this.medicationLookup.instance.reset();
            });
    }

    onSelectedAllergy($event) {
        if (this.isSignedOff) {
            this.selectedAllergy = [];
            return;
        }

        const selectedAllergy = $event.selectedRowsData[0];
        if (!selectedAllergy)
            return;

        const selectedAllergyId =
            selectedAllergy.Id;

        this.allergyDataService
            .getById(selectedAllergyId)
            .then((allergy) => {
                this.allergy = allergy;
                this.isCreateUpdatePopupOpened = true;
                this.isNewAllergy = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateAllergyForm() {
        this.resetValidation();
        this.isNewAllergy = true;
        this.allergy =
            new Allergy("", false, this.patientId);
    }

    private resetValidation() {
        this.allergyValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initMedicationDataSource();
        this.initAllergyDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.allergyDataService, PatientHistoryNames.allergiesHistory);

        this.allergy = new Allergy("", false, this.patientId);
    }

    private initMedicationDataSource() {
        this.medicationDataSource.store = this.lookupDataSourceProvider
            .medicationLookupDataSource;
    }

    private initAllergyDataSource(): any {
        this.allergyDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.allergyDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.allergyDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}