import { BaseEntityModel } from "./baseEntityModel";

export class Assessment extends BaseEntityModel {
    Diagnosis: string;
    Order: number;
    Notes: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);
        
        this.Diagnosis = "";
        this.Order = null;
        this.Notes = "";
    }

    createFromEntityModel(entity: any) {
        const assessment = new Assessment(entity.Id, !!entity.IsDelete);

        assessment.Diagnosis = entity.Diagnosis;
        assessment.Order = entity.Order;
        assessment.Notes = entity.Notes;

        return assessment;
    }

}