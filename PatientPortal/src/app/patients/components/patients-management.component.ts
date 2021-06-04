import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { MaskList } from 'src/app/_classes/maskList';
import { StateList } from 'src/app/_classes/stateList';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { Patient } from '../models/patient';
import { PatientInsurance } from '../models/patientInsurance';
import { Gender } from 'src/app/_classes/gender';
import { MaritalStatus } from '../classes/maritalStatus';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { PatientService } from '../../_services/patient.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { PatientInsuranceService } from '../../_services/patient-insurance.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { ZipCodeType } from '../models/zipCodeType';
import { ZipCodeTypeList } from 'src/app/_classes/zipCodeTypeList';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: 'patients-management',
    templateUrl: './patients-management.component.html'
})
export class PatientsManagementComponent implements OnInit, OnDestroy {
    @ViewChild("patientForm", { static: false }) patientForm: DxFormComponent;
    @ViewChild("insuranceForm", { static: false }) insuranceForm: DxFormComponent;
    @ViewChild("patientDataGrid", { static: false }) patientDataGrid: DxDataGridComponent;

    isCopyActionExecuting: boolean = false;

    private isNewInsurance = true;
    private isNewPatient = true;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    searchConfiguration: SearchConfiguration = new SearchConfiguration();
    validationMasks: MaskList = new MaskList();
    states: any[] = StateList.values;
    gender: any[] = Gender.values;
    maritalStatus: any[] = MaritalStatus.values;
    zipCodeTypes: any[] = ZipCodeTypeList.values;

    patientTab: any = { id: 1, title: 'Patient', template: 'patient' };
    patientInsuranceTab: any = { id: 2, title: 'Insurance', template: 'insurance' };

    patientDataTabs: Array<any> = [];

    patient: Patient;
    insurance: PatientInsurance;

    selectedPatients: Array<any> = [];
    patientDataSource: any = {};

    isPatientPopupOpened: boolean = false;

    get genderString(): string {
        if (!this.patient.gender)
            return "";

        return this.gender
            .find(g => g.value === this.patient.gender).name;
    }

    get zipMask(): string {
        switch (this.patient.zipCodeType) {
            case ZipCodeType.FiveDigit:
                return this.validationMasks.fiveDigitZip;
            case ZipCodeType.NineDigit:
                return this.validationMasks.nineDigitZip;
        }
    }

    get zipMaskInsurance(): string {
        switch (this.insurance.zipCodeType) {
            case ZipCodeType.FiveDigit:
                return this.validationMasks.fiveDigitZip;
            case ZipCodeType.NineDigit:
                return this.validationMasks.nineDigitZip;
        }
    }

    constructor(private companyIdService: CompanyIdService,
        private patientService: PatientService,
        private patientInsuranceService: PatientInsuranceService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) { }

    onPatientFieldChanged($event) {
        const dataField = $event.dataField;
        if (dataField === "zipCodeType" && $event.value)
            this.patient.zip = "";
    }

    onPatientInsuranceFieldChanged($event) {
        const dataField = $event.dataField;
        if (dataField === "zipCodeType" && $event.value) {
            if (this.isCopyActionExecuting) {
                this.isCopyActionExecuting = false;
                return;
            }

            this.insurance.zip = "";
        }
    }

    ngOnInit(): void {
        this.init();
        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    createUpdatePatientInsurance($event) {
        $event.preventDefault();

        const validationResult = this.insuranceForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        this.patientInsuranceService.save(this.insurance)
            .then((insurance) => {
                this.isNewInsurance = false;

                this.insurance.id = insurance.id;

                this.alertService.info("Patient insurance was saved successfully");
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    createUpdatePatient() {
        const validationResult =
            this.patientForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewPatient) {
            this.patient.companyId = this.companyId;
        }

        this.patientService.save(this.patient)
            .then((patient) => {
                this.isNewPatient = false;

                this.patient.id = patient.id;

                if (this.isNewInsurance && this.patientDataTabs.length == 1) {
                    this.patientDataTabs
                        .push(this.patientInsuranceTab);
                }

                this.alertService.info("Patient data was saved successfully");
                this.patientDataGrid.instance.refresh();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    openPatientForm() {
        this.patientDataTabs.push(this.patientTab);
        this.isPatientPopupOpened = true;
    }

    closePatientForm() {
        this.isPatientPopupOpened = false;
    }

    getFullNameDisplayExpression(item) {
        if (!item)
            return "";
        return `${item.FirstName} ${item.LastName}`;
    }

    onPatientPopupHidden() {
        this.patient = new Patient();
        this.insurance = new PatientInsurance();

        this.selectedPatients = [];
        this.patientDataTabs = [];

        this.isNewPatient = true;
        this.isNewInsurance = true;
    }

    refreshPatientsGrid() {
        this.patientDataGrid.instance.refresh();
    }

    onPatientSelected($event) {
        const patientSelectedRow = $event.selectedRowsData[0];

        if (!patientSelectedRow)
            return;

        const patientId = patientSelectedRow.id;

        const patientPromise = this.patientService.getById(patientId)
        const patientInsurancePromise = this.patientInsuranceService.getByPatientId(patientId);

        Promise.all([patientPromise, patientInsurancePromise])
            .then(result => {
                const patient = result[0];
                const insurance = result[1];

                this.patient = patient;
                this.isNewPatient = false;

                if (insurance) {
                    this.insurance = insurance;
                    this.isNewInsurance = false;
                }

                this.patientDataTabs.push(this.patientTab);
                this.patientDataTabs.push(this.patientInsuranceTab);

                this.isPatientPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    copyFromPatient() {
        this.isCopyActionExecuting = true;

        const patientFieldsToExclude = [
            "maritalStatus",
            "companyId",
            "id",
            "patientInsuranceId"
        ];

        const patient = this.patient;
        const insurance = this.insurance;

        if (!patient) {
            return;
        }

        for (let fieldName in patient) {
            if (patientFieldsToExclude.indexOf(fieldName) !== -1 || !patient.hasOwnProperty(fieldName)) {
                continue;
            }

            insurance[fieldName] = patient[fieldName];
        }

        insurance.patientId = patient.id;
    }

    private init(): any {
        this.initPatientDataStore();

        this.insurance = new PatientInsurance();
        this.patient = new Patient();
    }

    private initPatientDataStore(): any {
        this.patientDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("patient"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.patientDataGrid && this.patientDataGrid.instance)
                        this.patientDataGrid.instance.refresh();
                }
            });
    }
}