import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class VitalSigns extends BaseEntityModel {
    Pulse: number;
    BloodPressurePosition: string;
    BloodPressureLocation: string;
    SystolicBloodPressure: number;
    DiastolicBloodPressure: number;
    OxygenSaturationAtRest: string;
    RespirationRate: number;
    OxygenSaturationAtRestValue: number;
    PatientId: string;
    AdmissionId: string;
    CreateDate: any;

    constructor(id: string = "", isDelete: boolean = false,
        patientId: string = "", admissionId = "") {

        super(id, isDelete);

        this.PatientId = patientId;
        this.AdmissionId = admissionId;
        this.Pulse = null;
        this.OxygenSaturationAtRestValue = null;
        this.SystolicBloodPressure = null;
        this.OxygenSaturationAtRest = "";
        this.DiastolicBloodPressure = null;
        this.RespirationRate = null;
        this.BloodPressurePosition = "";
        this.BloodPressureLocation = "";
        this.CreateDate = new Date();
    }

    convertToEntityModel() {
        this.CreateDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreateDate);
    }

    createFromEntityModel(entity: any) {
        const newVitalSigns = new VitalSigns(entity.Id, !!entity.isDelete, entity.PatientId, entity.AdmissionId);
        
        newVitalSigns.Pulse = entity.Pulse;
        newVitalSigns.SystolicBloodPressure = entity.SystolicBloodPressure;
        newVitalSigns.DiastolicBloodPressure = entity.DiastolicBloodPressure;
        newVitalSigns.BloodPressurePosition = entity.BloodPressurePosition;
        newVitalSigns.BloodPressureLocation = entity.BloodPressureLocation;
        newVitalSigns.OxygenSaturationAtRest = entity.OxygenSaturationAtRest;
        newVitalSigns.OxygenSaturationAtRestValue = entity.OxygenSaturationAtRestValue;
        newVitalSigns.RespirationRate = entity.RespirationRate;

        newVitalSigns.CreateDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newVitalSigns;
    }
}