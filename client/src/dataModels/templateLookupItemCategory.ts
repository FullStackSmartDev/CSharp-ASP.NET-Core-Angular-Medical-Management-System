import { } from "./entityNameModel";
import { BaseEntityActiveModel } from "./baseEntityModel";

export class TemplateLookupItemCategory extends BaseEntityActiveModel {
    Name: string;
    Title: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);
        this.Name = "";
        this.Title = "";
    }

    createFromEntityModel(category: any) {
        const newCategory =
            new TemplateLookupItemCategory(category.Id, !!category.IsActive);
        newCategory.Name = category.Name;
        newCategory.Title = category.Title;

        return newCategory;
    }
}