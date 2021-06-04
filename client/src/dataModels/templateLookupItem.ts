import { BaseEntityActiveModel } from "./baseEntityModel";

export class TemplateLookupItem extends BaseEntityActiveModel {
    CompanyId: string;
    JsonValues: string;
    TemplateLookupItemCategoryId: string;
    Name: string;
    Title: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);
        this.CompanyId = null;
        this.JsonValues = "{\"Values\":[]}";
        this.Name = "";
        this.Title = "";
        this.TemplateLookupItemCategoryId = "";
    }

    createFromEntityModel(templateLookupItem: TemplateLookupItem) {
        const newTemplateLookupItem =
            new TemplateLookupItem(templateLookupItem.Id, !!templateLookupItem.IsActive);

        newTemplateLookupItem.CompanyId = templateLookupItem.CompanyId;
        newTemplateLookupItem.Name = templateLookupItem.Name;
        newTemplateLookupItem.Title = templateLookupItem.Title;

        newTemplateLookupItem.JsonValues =
            templateLookupItem.JsonValues;

        newTemplateLookupItem.TemplateLookupItemCategoryId =
            templateLookupItem.TemplateLookupItemCategoryId;

        return newTemplateLookupItem;
    }

}