import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class ChiefComplaintTemplate implements ConvertibleFromEntityModel {
    ChiefComplaintId: string;
    IsDelete: boolean;
    TemplateId: string;

    constructor(isDelete: boolean = false) {
        this.ChiefComplaintId = "";
        this.TemplateId = "";
        this.IsDelete = isDelete;
    }

    createFromEntityModel(entity: any) {
        const chiefComplaintTemplate = new ChiefComplaintTemplate(!!entity.isDelete);

        chiefComplaintTemplate.ChiefComplaintId = entity.ChiefComplaintId;
        chiefComplaintTemplate.TemplateId = entity.TemplateId;

        return chiefComplaintTemplate;
    }
}