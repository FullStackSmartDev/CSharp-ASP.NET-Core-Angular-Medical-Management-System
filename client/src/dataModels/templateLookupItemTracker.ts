import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class TemplateLookupItemTracker extends ConvertibleFromEntityModel {
    TemplateId: string;
    TemplateLookupItemId: string;
    NumberOfLookupItemsInTemplate: number;

    constructor() {
        super();
        this.TemplateId = ""
        this.TemplateLookupItemId = "";
        this.NumberOfLookupItemsInTemplate = 0;
    }

    createFromEntityModel(entity: any) {
        const templateLookupItemTracker = new TemplateLookupItemTracker();

        templateLookupItemTracker.TemplateId = entity.TemplateId;
        templateLookupItemTracker.TemplateLookupItemId = entity.TemplateLookupItemId;
        templateLookupItemTracker.NumberOfLookupItemsInTemplate = entity.NumberOfLookupItemsInTemplate;

        return templateLookupItemTracker;
    }
}