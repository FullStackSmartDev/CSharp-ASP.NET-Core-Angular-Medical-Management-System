import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class Keyword extends ConvertibleFromEntityModel {
    Id: string;
    Value: string;

    constructor(value: string = "") {
        super();

        this.Id = "";
        this.Value = value;
    }

    createFromEntityModel(entity: any) {
        const keyword = new Keyword();

        keyword.Id = entity.Id;
        keyword.Value = entity.Value;

        return keyword;
    }
}