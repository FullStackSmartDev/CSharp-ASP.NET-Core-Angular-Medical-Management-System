import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class KeywordIcdCode extends ConvertibleFromEntityModel {
    KeywordId: string;
    IcdCodeId: string;

    constructor() {
        super();

        this.KeywordId = "";
        this.IcdCodeId = "";
    }

    createFromEntityModel(entity: any) {
        const keywordIcdCode =
            new KeywordIcdCode();

        keywordIcdCode.KeywordId = entity.KeywordId;
        keywordIcdCode.IcdCodeId = entity.IcdCodeId;

        return keywordIcdCode;
    }
}