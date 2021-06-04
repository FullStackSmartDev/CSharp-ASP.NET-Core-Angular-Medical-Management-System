import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class MedicationHistory extends BaseEntityModel {
    Medication: string;
    MedicationStatus: string;
    Prn: boolean;
    Route: string;
    DoseSchedule: string;
    Units: string;
    Dose: number;
    PatientId: string;
    Notes: string;
    CreatedDate: any;

    constructor(id: string = "", isDelete: boolean = false, patientId: string = "") {
        super(id, isDelete);

        this.Units = "";
        this.Dose = null;
        this.Medication = "";
        this.MedicationStatus = "";
        this.DoseSchedule = "";
        this.Route = "";
        this.Notes = "";
        this.Prn = null;
        this.PatientId = patientId;
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newMedicationHistory = new MedicationHistory(entity.Id, !!entity.IsDelete);

        newMedicationHistory.Units = entity.Units;
        newMedicationHistory.Dose = entity.Dose;
        newMedicationHistory.Medication = entity.Medication;
        newMedicationHistory.MedicationStatus = entity.MedicationStatus;
        newMedicationHistory.DoseSchedule = entity.DoseSchedule;
        newMedicationHistory.Route = entity.Route;
        newMedicationHistory.Notes = entity.Notes;
        newMedicationHistory.Prn = !!entity.Prn;
        newMedicationHistory.PatientId = entity.PatientId;

        newMedicationHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        return newMedicationHistory;
    }
}