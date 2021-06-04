import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class MedicalHistory extends BaseEntityModel {
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
        const newMedicalHistory = new MedicalHistory(entity.Id, !!entity.IsDelete);

        newMedicalHistory.Diagnosis = entity.Diagnosis;
        newMedicalHistory.PatientId = entity.PatientId;
        newMedicalHistory.Notes = entity.Notes;

        newMedicalHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newMedicalHistory;
    }
}