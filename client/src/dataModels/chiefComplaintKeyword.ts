import { BaseEntityModel } from "./baseEntityModel";

export class ChiefComplaintKeyword extends BaseEntityModel{
    Value: string;
    
    constructor(id: string = "", IsDelete: boolean = false){
        super(id, IsDelete);
        this.Value = "";
    }

    createFromEntityModel(entity: any) {
        const chiefComplaintKeyword = new ChiefComplaintKeyword(entity.Id, !!entity.isDelete);

        chiefComplaintKeyword.Value = entity.Value;

        return chiefComplaintKeyword;
    }
}