import { ConvertibleFromEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class Medication extends ConvertibleFromEntityModel {
    Id: string;
    NdcCode: string;
    PackageDescription: string;
    ElevenDigitNdcCode: string;
    NonProprietaryName: string;
    DosageFormName: string;
    RouteName: string;
    SubstanceName: string;
    StrengthNumber: string;
    StrengthUnit: string;
    PharmaceuticalClasses: string;
    DeaSchedule: string;
    Status: string;
    LastUpdate: any;

    constructor(id: string = "") {
        super();

        this.Id = id;
        this.NdcCode = "";
        this.PackageDescription = "";
        this.ElevenDigitNdcCode = "";
        this.NonProprietaryName = "";
        this.DosageFormName = "";
        this.RouteName = "";
        this.SubstanceName = "";
        this.StrengthNumber = "";
        this.StrengthUnit = "";
        this.PharmaceuticalClasses = "";
        this.DeaSchedule = "";
        this.Status = "";
        this.LastUpdate = new Date();

    }

    createFromEntityModel(entity: any) {
        const newMedication =
            new Medication(entity.Id);

        newMedication.NdcCode = entity.NdcCode;
        newMedication.PackageDescription = entity.PackageDescription;
        newMedication.ElevenDigitNdcCode = entity.ElevenDigitNdcCode;
        newMedication.NonProprietaryName = entity.NonProprietaryName;
        newMedication.DosageFormName = entity.DosageFormName;
        newMedication.RouteName = entity.RouteName;
        newMedication.SubstanceName = entity.SubstanceName;
        newMedication.StrengthNumber = entity.StrengthNumber;
        newMedication.StrengthUnit = entity.StrengthUnit;
        newMedication.PharmaceuticalClasses = entity.PharmaceuticalClasses;
        newMedication.DeaSchedule = entity.DeaSchedule;
        newMedication.Status = entity.Status;
        newMedication.LastUpdate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.LastUpdate);

        return newMedication;
    }
}