import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class SurgicalHistory extends BaseEntityModel {
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
        const newSurgicalHistory = new SurgicalHistory(entity.Id, !!entity.IsDelete);

        newSurgicalHistory.Diagnosis = entity.Diagnosis;
        newSurgicalHistory.PatientId = entity.PatientId;
        newSurgicalHistory.Notes = entity.Notes;

        newSurgicalHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newSurgicalHistory;
    }
}