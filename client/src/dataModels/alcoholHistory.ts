import { TobaccoHistory } from "./TobaccoHistory";
import { DateConverter } from "../helpers/dateConverter";

export class AlcoholHistory extends TobaccoHistory {

    constructor(id: string = "", isDelete: boolean = false,
        patientId: string = "") {

        super(id, isDelete, patientId);
    }

    createFromEntityModel(entity: any) {
        const alcoholHistory =
            new AlcoholHistory(entity.Id, !!entity.isDelete);

        alcoholHistory.StatusLengthType = entity.StatusLengthType;
        alcoholHistory.Status = entity.Status;
        alcoholHistory.Type = entity.Type;
        alcoholHistory.Amount = entity.Amount;
        alcoholHistory.Use = entity.Use;
        alcoholHistory.Frequency = entity.Frequency;
        alcoholHistory.Length = entity.Length;
        alcoholHistory.Duration = entity.Duration;
        alcoholHistory.Quit = !!entity.Quit;
        alcoholHistory.StatusLength = entity.StatusLength;
        alcoholHistory.Notes = entity.Notes;
        alcoholHistory.PatientId = entity.PatientId;
        alcoholHistory.CreateDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreateDate);

        return alcoholHistory;
    }
}