import { BaseEntityModel } from "./baseEntityModel";

export class BaseVitalSigns extends BaseEntityModel {
    LeftCalf: number;
    RightCalf: number;
    RightThigh: number;
    LeftThigh: number;
    RightForearm: number;
    LeftForearm: number;
    RightBicep: number;
    LeftBicep: number;
    Height: number;
    Weight: number;
    PatientId: string;
    DominantHand: string;
    OxygenUse: string;
    OxygenAmount: number;

    constructor(id: string = "", isDelete: boolean = false,
        patientId: string = "") {

        super(id, isDelete);

        this.PatientId = patientId;
        this.LeftCalf = null;
        this.RightCalf = null;
        this.RightThigh = null;
        this.LeftThigh = null;
        this.LeftForearm = null;
        this.RightForearm = null;
        this.RightBicep = null;
        this.LeftBicep = null;
        this.Height = null;
        this.Weight = null;
        this.DominantHand = "";
        this.OxygenAmount = null;
        this.OxygenUse = "";
    }

    createFromEntityModel(entity: any) {
        const newVitalSigns = new BaseVitalSigns(entity.Id, !!entity.isDelete, entity.PatientId);

        newVitalSigns.LeftCalf = entity.LeftCalf;
        newVitalSigns.LeftBicep = entity.LeftBicep;
        newVitalSigns.LeftThigh = entity.LeftThigh;
        newVitalSigns.LeftForearm = entity.LeftForearm;
        newVitalSigns.RightCalf = entity.RightCalf;
        newVitalSigns.RightThigh = entity.RightThigh;
        newVitalSigns.RightForearm = entity.RightForearm;
        newVitalSigns.RightBicep = entity.RightBicep;
        newVitalSigns.Height = entity.Height;
        newVitalSigns.Weight = entity.Weight;
        newVitalSigns.DominantHand = entity.DominantHand;
        newVitalSigns.OxygenAmount = entity.OxygenAmount;
        newVitalSigns.OxygenUse = entity.OxygenUse;

        return newVitalSigns;
    }
}