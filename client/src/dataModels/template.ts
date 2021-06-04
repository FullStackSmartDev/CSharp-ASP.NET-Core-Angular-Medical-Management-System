import { BaseEntityActiveModel } from "./baseEntityModel";

export class Template extends BaseEntityActiveModel {
    CompanyId: string;
    TemplateOrder: number;
    Name: string;
    Title: string;
    ReportTitle: string;
    Value: string;
    DetailedTemplateHtml: string;
    DefaultTemplateHtml: string;
    IsRequired: boolean;
    TemplateTypeId: string;
    IsHistorical: boolean;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.CompanyId = "";
        this.TemplateOrder = null;
        this.Name = "";
        this.Title = "";
        this.ReportTitle = "";
        this.Value = "";
        this.DetailedTemplateHtml = "";
        this.DefaultTemplateHtml = "";
        this.IsRequired = false;
        this.IsHistorical = false;
        this.TemplateTypeId = "";
    }

    createFromEntityModel(entity: any) {
        const newTemplate = new Template(entity.Id, !!entity.IsActive);

        newTemplate.CompanyId = entity.CompanyId;
        newTemplate.TemplateOrder = entity.TemplateOrder;
        newTemplate.Name = entity.Name;
        newTemplate.Title = entity.Title;
        newTemplate.ReportTitle = entity.ReportTitle;
        newTemplate.Value = entity.Value;
        newTemplate.DetailedTemplateHtml = entity.DetailedTemplateHtml;
        newTemplate.DefaultTemplateHtml = entity.DefaultTemplateHtml;
        newTemplate.IsRequired = !!entity.IsRequired;
        newTemplate.IsHistorical = !!entity.IsHistorical;
        newTemplate.TemplateTypeId = entity.TemplateTypeId;
        
        return newTemplate;
    }
}