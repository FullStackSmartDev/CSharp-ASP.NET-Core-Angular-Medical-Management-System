import { BaseEntityModel } from "./baseEntityModel";

export class CptCode extends BaseEntityModel {
    Code: string;
    Name: string;
    Description: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Code = "";
        this.Name = "";
        this.Description = "";
    }

    createFromEntityModel(entity: any) {
        const cptCode =
            new CptCode(entity.Id, !!entity.isDelete);

        cptCode.Code = entity.Code;
        cptCode.Name = entity.Name;
        cptCode.Description = entity.Description;

        return cptCode;
    }
}