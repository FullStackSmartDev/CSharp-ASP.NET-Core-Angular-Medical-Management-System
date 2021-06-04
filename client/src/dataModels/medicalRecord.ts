import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class MedicalRecord extends BaseEntityModel {
    Diagnosis: string;
    PatientId: string;
    Notes: string;
    CreatedDate: any;

    constructor(id: string = "", isDelete: boolean = false, patientId: string = "") {
        super(id, isDelete);

        this.Diagnosis = "";
        this.PatientId = patientId;
        this.Notes = "";
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newMedicalRecord = new MedicalRecord(entity.Id, !!entity.IsDelete);

        newMedicalRecord.Diagnosis = entity.Diagnosis;
        newMedicalRecord.PatientId = entity.PatientId;
        newMedicalRecord.Notes = entity.Notes;

        newMedicalRecord.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newMedicalRecord;
    }
}