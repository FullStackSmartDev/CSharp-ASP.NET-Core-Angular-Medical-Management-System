import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class TobaccoHistory extends BaseEntityModel {
    Status: string;
    Type: string;
    Amount: number;
    Use: string;
    Frequency: string;
    Length: number;
    Duration: string;
    Quit: boolean;
    StatusLength: number;
    Notes: string;
    PatientId: string;
    CreateDate: any;
    StatusLengthType: string;

    constructor(id: string = "", isDelete: boolean = false,
        patientId: string = "") {

        super(id, isDelete);

        this.Status = "";
        this.Type = "";
        this.Amount = null;
        this.Use = "";
        this.Frequency = "";
        this.Length = null;
        this.Duration = "";
        this.Quit = null;
        this.StatusLength = 0;
        this.Notes = "";
        this.PatientId = patientId;
        this.StatusLengthType = "";
        this.CreateDate = new Date();
    }

    convertToEntityModel() {
        this.CreateDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreateDate);
    }

    createFromEntityModel(entity: any) {
        const newTobaccoHistory = new TobaccoHistory(entity.Id, !!entity.isDelete);

        newTobaccoHistory.StatusLengthType = entity.StatusLengthType;
        newTobaccoHistory.Status = entity.Status;
        newTobaccoHistory.Type = entity.Type;
        newTobaccoHistory.Amount = entity.Amount;
        newTobaccoHistory.Use = entity.Use;
        newTobaccoHistory.Frequency = entity.Frequency;
        newTobaccoHistory.Length = entity.Length;
        newTobaccoHistory.Duration = entity.Duration;
        newTobaccoHistory.Quit = !!entity.Quit;
        newTobaccoHistory.StatusLength = entity.StatusLength;
        newTobaccoHistory.Notes = entity.Notes;
        newTobaccoHistory.PatientId = entity.PatientId;
        
        newTobaccoHistory.CreateDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newTobaccoHistory;
    }
}