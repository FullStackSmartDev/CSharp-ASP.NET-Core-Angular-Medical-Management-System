import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class Allergy extends BaseEntityModel {
    Reaction: string;
    Medication: string;
    Notes: string;
    PatientId: string;
    CreatedDate: any;

    constructor(id: string = "", isDelete: boolean = false, patientId: string = "") {
        super(id, isDelete);

        this.Reaction = "";
        this.Medication = "";
        this.Notes = "";
        this.PatientId = patientId;
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newAllergy = new Allergy(entity.Id, !!entity.IsDelete);

        newAllergy.Reaction = entity.Reaction;
        newAllergy.Medication = entity.Medication;
        newAllergy.PatientId = entity.PatientId;
        newAllergy.Notes = entity.Notes;

        newAllergy.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        return newAllergy;
    }
}