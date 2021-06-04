import { Component, Input } from '@angular/core';
import { PatientDemographicDataService, VitalSignsDataService, BaseVitalSignsDataService, AllergyDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { PatientDemographic } from '../../dataModels/patientDemographic';
import { BaseVitalSigns } from '../../dataModels/baseVitalSigns';
import { MedicalCalculationHelper } from '../../helpers/medicalCalculationHelper';
import { Allergy } from '../../dataModels/allergy';
import { VitalSigns } from '../../dataModels/vitalSigns';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../constants/patientHistoryNames';

@Component({
    templateUrl: 'patientChartHeaderComponent.html',
    selector: 'patient-chart-header'
})

export class PatientChartHeaderComponent {
    @Input("patientChartHeaderData")
    set patientChartHeaderData(patientChartHeaderData: PatientChartHeaderData) {
        if (!patientChartHeaderData) {
            return;
        }
        this.refreshPatientHeader(patientChartHeaderData);
    }

    private _notSetMessage: string = "not set";

    isPatientChartHeaderReady: boolean = false;

    allergiesDefaultValue: string = "";

    isPatientAllergiesPopoverVisible: boolean = false;

    patientName: string = "";
    patientMrn: string = this._notSetMessage;
    patientDateOfBirth: any = null;

    patientAllergies: any = {
        latestPatientAllergy: "",
        restPatientAllergies: []
    };

    get isPatientHaveAllergies(): boolean {
        return !!this.patientAllergies
            .latestPatientAllergy;
    }

    get isPatientHaveOnlyOneAllergy(): boolean {
        return this.isPatientHaveAllergies
            && !this.patientAllergies.restPatientAllergies.length
    }

    patientVitalSigns: any = {
        height: this._notSetMessage,
        weight: this._notSetMessage,
        bmi: this._notSetMessage,
        pulse: this._notSetMessage,
        bloodPressure: {
            systolic: 0,
            diastolic: 0
        },
        resp: 0,
        o2Sat: 0
    };

    dateOfService: any;
    currentDate: any = new Date();

    constructor(private patientDemographicDataService: PatientDemographicDataService,
        private baseVitalSignsDataService: BaseVitalSignsDataService,
        private allergyDataService: AllergyDataService,
        private vitalSignsDataService: VitalSignsDataService,
        private defaultValuesProvider: DefaultValuesProvider) {
        this.initAllergiesDefaultValue();
    }

    togglePatientAllergiesPopover() {
        this.isPatientAllergiesPopoverVisible =
            !this.isPatientAllergiesPopoverVisible;
    }

    refreshPatientHeader(patientChartHeaderData: PatientChartHeaderData): void {
        this.isPatientChartHeaderReady = false;

        this.dateOfService = patientChartHeaderData.DateOfService;

        const patientId =
            patientChartHeaderData.PatientId;

        const patientPromise =
            this.patientDemographicDataService
                .getById(patientId);

        const patientBaseVitalSignsPromise =
            this.getPatientBaseVitalSignsPromise(patientId);

        const patientVitalSignsByAdmissionPromise =
            this.getPatientVitalSignsByAdmissionPromise(patientId, patientChartHeaderData.AdmissionId);

        const patientAllergiesPromise = this
            .getPatientAllergiesPromise(patientId, this.currentDate);

        Promise.all(
            [
                patientPromise,
                patientBaseVitalSignsPromise,
                patientAllergiesPromise,
                patientVitalSignsByAdmissionPromise
            ])
            .then(result => {
                const patient = result[0];
                this.setPatientPersonalInfo(patient);

                const patientBaseVitalSigns = result[1];

                if (patientBaseVitalSigns) {
                    this.setPatientBaseVitalSigns(patientBaseVitalSigns);
                }

                const patientAllergies = result[2];
                this.setPatientAllergies(patientAllergies);

                const patientVitalSigns = result[3];
                this.setPatientVitalSigns(patientVitalSigns);

                this.isPatientChartHeaderReady = true;
            });
    }

    private initAllergiesDefaultValue(): void {
        this.defaultValuesProvider
            .getByName(PatientHistoryNames.allergiesHistory)
            .then(defaultValue => {
                this.allergiesDefaultValue = defaultValue;
            });
    }

    private getPatientVitalSignsByAdmissionPromise(patientId: string, admissionId: string): Promise<VitalSigns[]> {
        const patientFilter = ["PatientId", "=", patientId];
        const admissionFilter = ["AdmissionId", "=", admissionId];
        const nonDeletedItemsFilter = ["IsDelete", "=", false];

        const filter = [patientFilter, "and", admissionFilter, "and", nonDeletedItemsFilter];
        const sort = [
            { selector: "CreateDate", desc: true }
        ];

        const loadOptions = {
            filter: filter,
            sort: sort
        }
        return this.vitalSignsDataService
            .search(loadOptions);
    }

    private setPatientAllergies(patientAllergies: Allergy[]): any {
        if (patientAllergies && patientAllergies.length) {
            const patientAllergyMedicationNames =
                patientAllergies.map(a => a.Medication);

            this.patientAllergies.latestPatientAllergy =
                patientAllergyMedicationNames[0];

            if (patientAllergies.length > 1) {
                this.patientAllergies.restPatientAllergies =
                    patientAllergyMedicationNames.slice(1);
            }
            else {
                this.patientAllergies.restPatientAllergies = [];
            }
        }
        else {
            this.resetPatientAllergies();
        }
    }

    private resetPatientAllergies() {
        this.patientAllergies.latestPatientAllergy = "";
        this.patientAllergies.restPatientAllergies = [];
    }

    private getPatientAllergiesPromise(patientId: string, dateOfService: Date) {
        const filterDate = new Date(dateOfService);
        filterDate.setDate(filterDate.getDate() + 1);

        const dateFilter = ["CreatedDate", "<", filterDate];
        const patientFilter = ["PatientId", "=", patientId];
        const isDeleteFilter = ["IsDelete", "=", false];

        const filter = [dateFilter, "and", patientFilter, "and", isDeleteFilter];

        const loadOptions = {
            filter: filter,
            sort: [
                {
                    selector: "CreatedDate",
                    desc: true
                }
            ]
        }

        return this.allergyDataService
            .search(loadOptions);
    }

    private getPatientBaseVitalSignsPromise(patientId: string) {
        const patientFilter = ["PatientId", "=", patientId];

        const loadOptions = {
            filter: patientFilter
        }

        return this.baseVitalSignsDataService
            .firstOrDefault(loadOptions);
    }

    private setPatientBaseVitalSigns(patientVitalSigns: BaseVitalSigns): void {
        const patientHeight = patientVitalSigns.Height;
        const patientWeight = patientVitalSigns.Weight;

        if (patientHeight) {
            this.patientVitalSigns.height = patientHeight;
        }

        if (patientWeight) {
            this.patientVitalSigns.weight = patientWeight;
        }

        if (patientWeight && patientHeight) {
            this.patientVitalSigns.bmi = MedicalCalculationHelper
                .calculateBmi(patientHeight, patientWeight);
        }
    }

    private setPatientVitalSigns(patientVitalSignsByAdmission: VitalSigns[]): void {
        if (!patientVitalSignsByAdmission || !patientVitalSignsByAdmission.length) {
            return;
        }

        let isSystolicBloodPressureSet, isDiastolicBloodPressureSet,
            isRespirationRateSet, isO2SatSet, isPulseSet = false;

        for (let i = 0; i < patientVitalSignsByAdmission.length; i++) {
            const vitalSigns = patientVitalSignsByAdmission[i];

            if (!isSystolicBloodPressureSet && vitalSigns.SystolicBloodPressure) {
                this.patientVitalSigns.bloodPressure.systolic =
                    vitalSigns.SystolicBloodPressure;
                isSystolicBloodPressureSet = true;
            }

            if (!isDiastolicBloodPressureSet && vitalSigns.DiastolicBloodPressure) {
                this.patientVitalSigns.bloodPressure.diastolic
                    = vitalSigns.DiastolicBloodPressure;
                isDiastolicBloodPressureSet = true;
            }

            if (!isRespirationRateSet && vitalSigns.RespirationRate) {
                this.patientVitalSigns.resp = vitalSigns.RespirationRate;
                isRespirationRateSet = true;
            }

            if (!isO2SatSet && vitalSigns.OxygenSaturationAtRestValue) {
                this.patientVitalSigns.o2Sat = vitalSigns.OxygenSaturationAtRestValue;
                isO2SatSet = true;
            }

            if (!isPulseSet && vitalSigns.Pulse) {
                this.patientVitalSigns.pulse = vitalSigns.Pulse;
                isPulseSet = true;
            }
        }
    }

    private setPatientPersonalInfo(patient: PatientDemographic): void {
        this.patientName = `${patient.FirstName} ${patient.LastName}`;
        this.patientDateOfBirth = patient.DateOfBirth;
    }
}

export class PatientChartHeaderData {
    PatientId: string;
    AdmissionId: string;
    DateOfService: any;

    constructor(patientId: string, admissionId: string, dateOfService: any) {
        this.PatientId = patientId;
        this.AdmissionId = admissionId;
        this.DateOfService = dateOfService;
    }
}