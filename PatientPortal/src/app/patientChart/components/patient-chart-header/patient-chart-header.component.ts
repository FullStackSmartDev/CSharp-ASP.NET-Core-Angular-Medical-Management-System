import { Component, Input } from "@angular/core";
import { PatientChartHeaderData } from '../../models/patientChartHeaderData';
import { PatientService } from 'src/app/_services/patient.service';
import { BaseVitalSignsService } from '../../patient-chart-tree/services/base-vital-signs.service';
import { AllergyService } from '../../patient-chart-tree/services/allergy.service';
import { VitalSignsService } from '../../patient-chart-tree/services/vital-signs.service';
import { Allergy } from '../../models/allergy';
import { BaseVitalSigns } from '../../models/baseVitalSigns';
import { MedicalCalculationHelper } from 'src/app/_helpers/medical-calculation.helper';
import { VitalSigns } from '../../models/vitalSigns';
import { Patient } from 'src/app/patients/models/patient';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { Constants } from 'src/app/_classes/constants';

@Component({
    templateUrl: "patient-chart-header.component.html",
    selector: "patient-chart-header"
})

export class PatientChartHeaderComponent {
    @Input("patientChartHeaderData")
    set patientChartHeaderData(patientChartHeaderData: PatientChartHeaderData) {
        if (!patientChartHeaderData) {
            return;
        }
        this.refreshPatientHeader(patientChartHeaderData);
    }

    isPatientChartHeaderReady: boolean = false;

    allergiesDefaultValue: string = "";

    isPatientAllergiesPopoverVisible: boolean = false;

    patientName: string = "";
    patientMrn: string = Constants.messages.notSet;
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
        height: Constants.messages.notSet,
        weight: Constants.messages.notSet,
        bmi: Constants.messages.notSet,
        pulse: Constants.messages.notSet,
        bloodPressure: {
            systolic: 0,
            diastolic: 0
        },
        resp: 0,
        o2Sat: 0
    };

    dateOfService: any;
    currentDate: any = new Date();

    constructor(private patientService: PatientService,
        private baseVitalSignsService: BaseVitalSignsService,
        private allergyService: AllergyService,
        private vitalSignsService: VitalSignsService,
        private defaultValueService: DefaultValueService) {

        this.initAllergiesDefaultValue();
    }

    togglePatientAllergiesPopover() {
        this.isPatientAllergiesPopoverVisible =
            !this.isPatientAllergiesPopoverVisible;
    }

    refreshPatientHeader(patientChartHeaderData: PatientChartHeaderData): void {
        this.isPatientChartHeaderReady = false;

        this.dateOfService = patientChartHeaderData.dateOfService;
        const patientId = patientChartHeaderData.patientId;

        const patientPromise = this.patientService.getById(patientId);

        const patientBaseVitalSignsPromise = this.baseVitalSignsService.getByPatientId(patientId);

        const patientVitalSignsByAdmissionPromise = this.vitalSignsService
            .getByPatientAndAdmissionIds(patientId, patientChartHeaderData.admissionId);

        this.currentDate = new Date();

        const patientAllergiesPromise = this.allergyService
            .getByPatientIdAndDate(patientId, this.currentDate);

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
        this.defaultValueService.getByKeyName("allergieshistory")
            .then(defaultValue => {
                this.allergiesDefaultValue = defaultValue.value ? defaultValue.value : "";
            });
    }

    private setPatientAllergies(patientAllergies: Allergy[]): any {
        if (patientAllergies && patientAllergies.length) {
            const patientAllergyMedicationNames =
                patientAllergies.map(a => a.medication);

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

    private setPatientBaseVitalSigns(patientVitalSigns: BaseVitalSigns): void {
        const patientHeight = patientVitalSigns.height;
        const patientWeight = patientVitalSigns.weight;

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

            if (!isSystolicBloodPressureSet && vitalSigns.systolicBloodPressure) {
                this.patientVitalSigns.bloodPressure.systolic =
                    vitalSigns.systolicBloodPressure;
                isSystolicBloodPressureSet = true;
            }

            if (!isDiastolicBloodPressureSet && vitalSigns.diastolicBloodPressure) {
                this.patientVitalSigns.bloodPressure.diastolic
                    = vitalSigns.diastolicBloodPressure;
                isDiastolicBloodPressureSet = true;
            }

            if (!isRespirationRateSet && vitalSigns.respirationRate) {
                this.patientVitalSigns.resp = vitalSigns.respirationRate;
                isRespirationRateSet = true;
            }

            if (!isO2SatSet && vitalSigns.oxygenSaturationAtRestValue) {
                this.patientVitalSigns.o2Sat = vitalSigns.oxygenSaturationAtRestValue;
                isO2SatSet = true;
            }

            if (!isPulseSet && vitalSigns.pulse) {
                this.patientVitalSigns.pulse = vitalSigns.pulse;
                isPulseSet = true;
            }
        }
    }

    private setPatientPersonalInfo(patient: Patient): void {
        this.patientName = `${patient.firstName} ${patient.lastName}`;
        this.patientDateOfBirth = patient.dateOfBirth;
    }
}