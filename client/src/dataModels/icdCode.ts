import { ConvertibleFromEntityModel } from "./baseEntityModel";
import { GuidHelper } from "../helpers/guidHelper";

export class IcdCode extends ConvertibleFromEntityModel {
    Id: string;
    Code: string;
    Name: string;
    Notes: string;

    constructor(id: string = "") {
        super();

        this.Id = id ? id : GuidHelper.generateNewGuid();
        this.Code = "";
        this.Name = "";
        this.Notes = "";
    }

    createFromEntityModel(entity: any) {
        const icdCode =
            new IcdCode(entity.Id);

        icdCode.Code = entity.Code;
        icdCode.Name = entity.Name;
        icdCode.Notes = entity.Notes;

        return icdCode;
    }
}