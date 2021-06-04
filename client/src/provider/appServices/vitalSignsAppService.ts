import { Injectable } from "@angular/core";
import { BaseVitalSignsDataService, VitalSignsDataService } from "../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { VitalSigns } from "../../dataModels/vitalSigns";
import { BaseVitalSigns } from "../../dataModels/baseVitalSigns";
import { MedicalCalculationHelper } from "../../helpers/medicalCalculationHelper";

export class BloodPressureModel {
    systolic: number;
    diastolic: number;

    constructor() {
        this.diastolic = 0;
        this.systolic = 0;
    }
}

export class VitalSignsSideModel {
    Calf: number;
    Thigh: number;
    Forearm: number;
    Bicep: number;

    constructor() {
        this.Calf = 0;
        this.Thigh = 0;
        this.Forearm = 0;
        this.Bicep = 0;
    }
}

export class AggregationVitalSignsModel {
    vitalSigns: VitalSignsModel;
    baseVitalSigns: BaseVitalSignsModel;

    constructor(vitalSigns: VitalSignsModel, baseVitalSigns: BaseVitalSignsModel) {
        this.vitalSigns = vitalSigns;
        this.baseVitalSigns = baseVitalSigns;
    }
}

export class VitalSignsModel {
    bloodPressure: BloodPressureModel;
    respirationRate: number;
    oxygenSaturationAtRestValue: number;
    pulse: number;

    constructor() {
        this.bloodPressure = new BloodPressureModel();
        this.oxygenSaturationAtRestValue = 0;
        this.pulse = 0;
        this.oxygenSaturationAtRestValue = 0;
    }
}

export class BaseVitalSignsModel {
    height: number;
    weight: number;
    dominantHand: string;
    rightSideValues: VitalSignsSideModel
    leftSideValues: VitalSignsSideModel
    oxygenUse: string;
    oxygenAmount: number;

    constructor() {
        this.height = 0;
        this.weight = 0;
        this.dominantHand = "";
        this.rightSideValues = new VitalSignsSideModel();
        this.leftSideValues = new VitalSignsSideModel();
        this.oxygenUse = "";
        this.oxygenAmount = 0;
    }

    get bmi(): string {
        if (!this.height || !this.weight) {
            return "";
        }

        return MedicalCalculationHelper
            .calculateBmi(this.height, this.weight);
    }
}

@Injectable()
export class VitalSignsAppService {
    constructor(private baseVitalSignsDataService: BaseVitalSignsDataService,
        private vitalSignsDataService: VitalSignsDataService) {
    }

    getLatestByAdmission(admissionId: string, patientId: string): Promise<AggregationVitalSignsModel> {
        const patientBaseVitalSignsPromise =
            this.getPatientBaseVitalSigns(patientId);

        const patientVitalSignsByAdmissionPromise =
            this.getPatientVitalSignsByAdmission(patientId, admissionId);

        return Promise.all([patientBaseVitalSignsPromise, patientVitalSignsByAdmissionPromise])
            .then(result => {
                const baseVitalSigns = result[0];
                const adjustedBaseVitalSigns =
                    this.adjustBaseVitalSigns(baseVitalSigns);

                const patientVitalSigns = result[1];
                const adjustedVitalSigns = this.adjustVitalSigns(patientVitalSigns);

                return new AggregationVitalSignsModel(adjustedVitalSigns, adjustedBaseVitalSigns);
            });
    }

    getPatientBaseVitalSigns(patientId: string): Promise<BaseVitalSigns> {
        const patientFilter = ["PatientId", "=", patientId];

        const loadOptions = {
            filter: patientFilter
        }

        return this.baseVitalSignsDataService
            .firstOrDefault(loadOptions);
    }

    getPatientVitalSignsByAdmission(patientId: string, admissionId: string): Promise<VitalSigns[]> {
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

    private adjustVitalSigns(patientVitalSigns: VitalSigns[]): VitalSignsModel {
        const vitalSignsModel = new VitalSignsModel();

        if (!patientVitalSigns || !patientVitalSigns.length) {
            return vitalSignsModel;
        }

        let isSystolicBloodPressureSet, isDiastolicBloodPressureSet,
            isRespirationRateSet, isO2SatSet, isPulseSet = false;

        for (let i = 0; i < patientVitalSigns.length; i++) {
            const vitalSigns = patientVitalSigns[i];

            if (!isSystolicBloodPressureSet && vitalSigns.SystolicBloodPressure) {
                vitalSignsModel.bloodPressure.systolic =
                    vitalSigns.SystolicBloodPressure;
                isSystolicBloodPressureSet = true;
            }

            if (!isDiastolicBloodPressureSet && vitalSigns.DiastolicBloodPressure) {
                vitalSignsModel.bloodPressure.diastolic
                    = vitalSigns.DiastolicBloodPressure;
                isDiastolicBloodPressureSet = true;
            }

            if (!isRespirationRateSet && vitalSigns.RespirationRate) {
                vitalSignsModel.respirationRate = vitalSigns.RespirationRate;
                isRespirationRateSet = true;
            }

            if (!isO2SatSet && vitalSigns.OxygenSaturationAtRestValue) {
                vitalSignsModel.oxygenSaturationAtRestValue =
                    vitalSigns.OxygenSaturationAtRestValue;
                isO2SatSet = true;
            }

            if (!isPulseSet && vitalSigns.Pulse) {
                vitalSignsModel.pulse = vitalSigns.Pulse;
                isPulseSet = true;
            }
        }

        return vitalSignsModel;
    }

    private adjustBaseVitalSigns(baseVitalSigns: BaseVitalSigns): BaseVitalSignsModel {
        const baseVitalSignsModel = new BaseVitalSignsModel();

        if (!baseVitalSigns) {
            return baseVitalSignsModel;
        }

        baseVitalSignsModel.height = baseVitalSigns.Height;
        baseVitalSignsModel.weight = baseVitalSigns.Weight;
        baseVitalSignsModel.dominantHand = baseVitalSigns.DominantHand;
        baseVitalSignsModel.leftSideValues.Calf = baseVitalSigns.LeftCalf;
        baseVitalSignsModel.rightSideValues.Calf = baseVitalSigns.RightCalf;
        baseVitalSignsModel.rightSideValues.Thigh = baseVitalSigns.RightThigh;
        baseVitalSignsModel.leftSideValues.Thigh = baseVitalSigns.LeftThigh;
        baseVitalSignsModel.rightSideValues.Forearm = baseVitalSigns.RightForearm;
        baseVitalSignsModel.leftSideValues.Forearm = baseVitalSigns.LeftForearm;
        baseVitalSignsModel.rightSideValues.Bicep = baseVitalSigns.RightBicep;
        baseVitalSignsModel.leftSideValues.Bicep = baseVitalSigns.LeftBicep;
        baseVitalSignsModel.oxygenUse = baseVitalSigns.OxygenUse;
        baseVitalSignsModel.oxygenAmount = baseVitalSigns.OxygenAmount;

        return baseVitalSignsModel;
    }
}