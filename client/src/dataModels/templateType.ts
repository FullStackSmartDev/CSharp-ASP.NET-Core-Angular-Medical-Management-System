import { BaseEntityActiveModel } from "./baseEntityModel";

export class TemplateType extends BaseEntityActiveModel {
    CompanyId: string;
    Name: string;
    Title: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);
        
        this.CompanyId = null;
        this.Name = "";
        this.Title = "";
    }

    createFromEntityModel(templateType: any) {
        const newTemplateType =
            new TemplateType(templateType.Id, !!templateType.IsActive);

        newTemplateType.CompanyId = templateType.CompanyId;
        newTemplateType.Name = templateType.Name;
        newTemplateType.Title = templateType.Title;

        return newTemplateType;
    }
}