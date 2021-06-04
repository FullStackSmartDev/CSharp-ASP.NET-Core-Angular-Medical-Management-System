import { BaseEntityModel } from "./baseEntityModel";

export class ChiefComplaint extends BaseEntityModel {
    Name: string;
    Title: string;
    CompanyId: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Name = "";
        this.Title = "";
        this.CompanyId = "";
    }

    createFromEntityModel(entity: any) {
        const chiefComplaint = new ChiefComplaint(entity.Id, !!entity.isDelete);

        chiefComplaint.Name = entity.Name;
        chiefComplaint.Title = entity.Title;
        chiefComplaint.CompanyId = entity.CompanyId;

        return chiefComplaint;
    }
}