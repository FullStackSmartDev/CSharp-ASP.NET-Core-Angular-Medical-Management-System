import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class IcdCodeKeywordsView extends ConvertibleFromEntityModel {
    IcdCodeId: string;
    IcdCodeName: string;
    IcdCodeDescription: string;
    Keywords: string;

    constructor() {
        super();

        this.Keywords = "";
        this.IcdCodeDescription = "";
        this.IcdCodeName = "";
        this.IcdCodeId = "";
    }

    createFromEntityModel(entity: any) {
        const icdCodeKeywordsView =
            new IcdCodeKeywordsView();

        icdCodeKeywordsView.Keywords = entity.Keywords;
        icdCodeKeywordsView.IcdCodeDescription = entity.IcdCodeDescription;
        icdCodeKeywordsView.IcdCodeName = entity.IcdCodeName;
        icdCodeKeywordsView.IcdCodeId = entity.IcdCodeId;

        return icdCodeKeywordsView;
    }
}