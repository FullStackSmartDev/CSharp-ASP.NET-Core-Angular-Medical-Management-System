import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class ChiefComplaintRelatedKeyword extends ConvertibleFromEntityModel {
    ChiefComplaintId: string;
    IsDelete: boolean;
    KeywordId: string;

    constructor(isDelete: boolean = false) {
        super();
        this.ChiefComplaintId = ""
        this.KeywordId = "";
        this.IsDelete = isDelete;
    }

    createFromEntityModel(entity: any) {
        const chiefComplaintRelatedKeyword = new ChiefComplaintRelatedKeyword(!!entity.isDelete);

        chiefComplaintRelatedKeyword.ChiefComplaintId = entity.ChiefComplaintId;
        chiefComplaintRelatedKeyword.KeywordId = entity.KeywordId;

        return chiefComplaintRelatedKeyword;
    }
}