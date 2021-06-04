import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class FamilyHistory extends BaseEntityModel {
    FamilyMember: string;
    FamilyStatus: string;
    PatientId: string;
    CreatedDate: any;
    Diagnosis: string;
    Notes: string;

    constructor(id: string = "", isDelete: boolean = false, patientId: string = "") {
        super(id, isDelete);

        this.FamilyMember = "";
        this.PatientId = patientId;
        this.FamilyStatus = "";
        this.Diagnosis = "";
        this.Notes = "";
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newFamilyHistory = new FamilyHistory(entity.Id, !!entity.IsDelete);

        newFamilyHistory.Diagnosis = entity.Diagnosis;
        newFamilyHistory.Notes = entity.Notes;
        newFamilyHistory.PatientId = entity.PatientId;
        newFamilyHistory.FamilyMember = entity.FamilyMember;
        newFamilyHistory.FamilyStatus = entity.FamilyStatus;

        newFamilyHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newFamilyHistory;
    }
}