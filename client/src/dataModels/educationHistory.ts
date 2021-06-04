import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class EducationHistory extends BaseEntityModel {
    PatientId: string;
    Notes: string;
    Degree: string;
    CreatedDate: any;
    YearCompleted: number;


    constructor(id: string = "", isDelete: boolean = false, patientId: string = "") {
        super(id, isDelete);

        this.Degree = "";
        this.YearCompleted = null;
        this.PatientId = patientId;
        this.Notes = "";
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newEducationHistory = new EducationHistory(entity.Id, !!entity.IsDelete);

        newEducationHistory.Degree = entity.Degree;
        newEducationHistory.PatientId = entity.PatientId;
        newEducationHistory.Notes = entity.Notes;
        newEducationHistory.YearCompleted = entity.YearCompleted;

        newEducationHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        return newEducationHistory;
    }
}