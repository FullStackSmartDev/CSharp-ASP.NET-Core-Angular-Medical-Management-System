import { TobaccoHistory } from "./TobaccoHistory";
import { DateConverter } from "../helpers/dateConverter";

export class DrugHistory extends TobaccoHistory {
    Route: string;

    constructor(id: string = "", isDelete: boolean = false,
        patientId: string = "") {

        super(id, isDelete, patientId);
        this.Route = "";
    }

    createFromEntityModel(entity: any) {
        const newDrugHistory = new DrugHistory(entity.Id, !!entity.isDelete);

        newDrugHistory.StatusLengthType = entity.StatusLengthType;
        newDrugHistory.Route = entity.Route;
        newDrugHistory.Status = entity.Status;
        newDrugHistory.Type = entity.Type;
        newDrugHistory.Amount = entity.Amount;
        newDrugHistory.Use = entity.Use;
        newDrugHistory.Frequency = entity.Frequency;
        newDrugHistory.Length = entity.Length;
        newDrugHistory.Duration = entity.Duration;
        newDrugHistory.Quit = !!entity.Quit;
        newDrugHistory.StatusLength = entity.StatusLength;
        newDrugHistory.Notes = entity.Notes;
        newDrugHistory.PatientId = entity.PatientId;
        newDrugHistory.CreateDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return newDrugHistory;
    }
}