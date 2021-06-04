import { BaseEntityModel } from "./baseEntityModel";

export class ChiefComplaintKeywordsView extends BaseEntityModel {
    Keyword: string;
    Title: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete)

        this.Keyword = "";
        this.Title = "";
    }

    createFromEntityModel(entity: any) {
        const chiefComplaintKeywords =
            new ChiefComplaintKeywordsView(entity.Id, !!entity.IsDelete);

        chiefComplaintKeywords.Keyword = entity.PatientId;
        chiefComplaintKeywords.Title = entity.Title;

        return chiefComplaintKeywords;
    }

}