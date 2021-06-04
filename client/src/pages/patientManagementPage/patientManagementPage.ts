import { Component, ViewChild } from '@angular/core';
import { ToastService } from '../../provider/toastService';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../../components/patientHistory/baseHistoryComponent';
import { AlertService } from '../../provider/alertService';
import { LoadPanelService } from '../../provider/loadPanelService';
import { TemplateLookupItemValidationDataService } from '../../provider/dataServices/read/templateLookupItemValidationDataService';
import { PatientInsuranceDataService, PatientDemographicDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LookupTables } from '../../enums/lookupTables';
import { ValidationMasks } from '../../constants/validationMasks';
import { PatientDemographic } from '../../dataModels/patientDemographic';
import { PatientInsurance } from '../../dataModels/patientInsurance';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { LookupItemsAppService } from '../../provider/appServices/lookupItemsAppService';

@Component({
    selector: 'patient-management-page',
    templateUrl: 'patientManagementPage.html'
})
export class PatientManagementPage extends BaseHistoryComponent {
    @ViewChild("demographicForm") demographicForm: DxFormComponent;
    @ViewChild("insuranceForm") insuranceForm: DxFormComponent;

    @ViewChild("patientDataGrid") patientDataGrid: DxDataGridComponent;

    private _isNewInsurance = true;
    private _isNewDemographic = true;

    _patientDemographicTab: any =
        { id: 1, title: 'Demographics', template: 'demographics' };

    _patientInsuranceTab: any =
        { id: 2, title: 'Insurance', template: 'insurance' };

    patientDataTabs: Array<any> = [];

    lookups = LookupTables;
    validationMasks = ValidationMasks;

    get lookupItemNames(): Array<string> {
        return [];
    };

    demographic: PatientDemographic;
    insurance: PatientInsurance;

    physianDataSource: any = {};
    locationDataSource: any = {};
    selectedPatients: Array<any> = [];
    patientDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    patientsFilter: any = {}

    constructor(
        private patientInsuranceDataService: PatientInsuranceDataService,
        private patientDemographicDataService: PatientDemographicDataService,
        alertService: AlertService,
        loadPanelService: LoadPanelService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        private lookupDataSourceProvider: LookupDataSourceProvider,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService, toastService,
            defaultValuesProvider, lookupItemsAppService);

        this.init();
    }

    createUpdatePatientInsurance($event) {
        $event.preventDefault();

        const validationResult =
            this.insuranceForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        const self = this;
        const createInsurancePromise = this._isNewInsurance
            ? this.patientInsuranceDataService.create(this.insurance)
            : this.patientInsuranceDataService.update(this.insurance);

        this.loadPanelService.showLoader();

        createInsurancePromise
            .then(() => {
                self.loadPanelService.hideLoader();
                self._isNewInsurance = false;

                self.toastService
                    .showSuccessMessage("Patient insurance successfully saved")
            })
            .catch(error => {
                self.loadPanelService.hideLoader();
                self.toastService.showErrorMessage(error.message ? error.message : "Error happened during patient creation")
            });
    }

    createUpdatePatientDemographic($event) {
        $event.preventDefault();
        const validationResult =
            this.demographicForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        this.loadPanelService.showLoader();

        const self = this;

        this.demographic.CompanyId =
            "EC3A7738-0E2A-4045-8841-420D9F14BECF"

        const createUpdatePromise = this._isNewDemographic
            ? this.patientDemographicDataService.create(this.demographic)
            : this.patientDemographicDataService.update(this.demographic);

        createUpdatePromise
            .then(() => {
                this.loadPanelService
                    .hideLoader();

                if (self._isNewInsurance) {
                    self.patientDataTabs
                        .push(self._patientInsuranceTab);
                }

                self.patientDataGrid
                    .instance
                    .refresh();

                self.toastService
                    .showSuccessMessage("Patient Demographic successfully saved")
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();
                self.toastService.showErrorMessage(error.message ? error.message : "Error happened during patient creation")
            });
    }

    closePatientInfoCreateUpdatePopup() {
        this.isCreateUpdatePopupOpened = false;
    }

    openPatientDataCreationForm($event) {
        $event.preventDefault();
        this.patientDataTabs.push(this._patientDemographicTab);

        this.isCreateUpdatePopupOpened = true;
    }

    getFullNameDisplayExpression(item) {
        if (!item)
            return "";
        return `${item.FirstName} ${item.LastName}`;
    }

    onCreateUpdatePopupHidden() {
        this.demographic = new PatientDemographic();
        this.insurance = new PatientInsurance();

        this.selectedPatients = [];
        this.patientDataTabs = [];

        this._isNewDemographic = true;
        this._isNewInsurance = true;
    }

    refreshPatientsGrid() {
        this.patientDataGrid.instance.refresh();
    }

    onPatientSelected($event) {
        const patientSelectedRow =
            $event.selectedRowsData[0];

        if (!patientSelectedRow)
            return;

        const patientId = patientSelectedRow.Id;

        const self = this;

        const patientDemographicPromise = this.patientDemographicDataService
            .getById(patientId)

        const patientInsuranceLoadOptions = {
            filter: ["PatientDemographicId", "=", patientId]
        }
        const patientInsurancePromise = this.patientInsuranceDataService
            .firstOrDefault(patientInsuranceLoadOptions);

        Promise.all([patientDemographicPromise, patientInsurancePromise])
            .then(result => {
                const demographic = result[0];
                const insurance = result[1];

                self.demographic = demographic;
                self._isNewDemographic = false;

                if (insurance) {
                    self.insurance = insurance;
                    self._isNewInsurance = false;
                }

                self.patientDataTabs.push(self._patientDemographicTab);
                self.patientDataTabs.push(self._patientInsuranceTab);

                self.isCreateUpdatePopupOpened = true;
            })
            .catch(error => {
                self.toastService.showErrorMessage(error.message ? error.message : error);
            });
    }

    searchPatients() {
        console.log("not implemented");
    }

    copyFromDemographics($event) {
        $event.preventDefault();
        const demographicsFieldsToExclude = [
            "MaritalStatus",
            "CompanyId",
            "Id",
            "IsDelete",
            "PatientInsuranceId"
        ];
        const demographics = this.demographic;
        const insurance = this.insurance;

        if (!demographics) {
            return;
        }

        for (let fieldName in demographics) {
            if (demographicsFieldsToExclude.indexOf(fieldName) !== -1
                || !demographics.hasOwnProperty(fieldName)) {

                continue;
            }

            insurance[fieldName] = demographics[fieldName];
        }

        insurance.PatientDemographicId = demographics.Id;
    }

    private init(): any {
        this.initPhysianDataSource();
        this.initPatientDataStore();
        this.initLocationDataStore();

        this.insurance = new PatientInsurance();
        this.demographic = new PatientDemographic();
    }

    private initPatientDataStore(): any {
        const self = this;
        this.patientDataSource.store = new CustomStore({
            byKey: (key) => {
                return self.patientDemographicDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                loadOptions.sort = [
                    {
                        selector: "LastName",
                        desc: false
                    }
                ]
                return self.patientDemographicDataService
                    .searchWithCount(loadOptions, "Id")
                    .then((data: any) => {
                        self.adjustPatientsDataBeforeRendering(data.data);
                        return data;
                    })
                    .catch(error => self.toastService.showErrorMessage(error.message ? error.message : error));
            }
        });
    }


    private adjustPatientsDataBeforeRendering(patients: any): any {
        patients.forEach(patient => {
            patient.MaritalStatus = LookupTables.maritalStatus
                .filter(m => m.Value === patient.MaritalStatus)[0].Name;

            patient.State = LookupTables.newState
                .filter(m => m.Value === patient.State)[0].Name;
        });
    }

    private initPhysianDataSource(): any {
        const physianEmploymentType = LookupTables
            .employeeType.filter(t => t.Name === "Physician")[0].Value;

        this.physianDataSource.store =
            this.lookupDataSourceProvider
                .getEmploymentLookupDataSource(physianEmploymentType)
    }

    initLocationDataStore(): any {
        this.locationDataSource.store =
            this.lookupDataSourceProvider.locationLookupDataSource;

    }
}