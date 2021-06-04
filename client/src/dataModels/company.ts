import { BaseEntityModel } from "./baseEntityModel";

export class Company extends BaseEntityModel {
    Name: string;
    Address: string;
    SecondaryAddress: string;
    City: string;
    State: string;
    ZipCode: string;
    Phone: string;
    Fax: string;
    WebSiteUrl: string;
    PatientDataModelId: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Name = "";
        this.Address = "";
        this.SecondaryAddress = "";
        this.City = "";
        this.State = "";
        this.ZipCode = "";
        this.Phone = "";
        this.Fax = "";
        this.WebSiteUrl = "";
        this.PatientDataModelId = "";

    }

    createFromEntityModel(companyModel: any) {
        const company =
            new Company(companyModel.Id, !!companyModel.IsDelete);

        company.Name = companyModel.Name;
        company.Address = companyModel.Address;
        company.SecondaryAddress = companyModel.SecondaryAddress;
        company.City = companyModel.City;
        company.State = companyModel.State;
        company.ZipCode = companyModel.ZipCode;
        company.Phone = companyModel.Phone;
        company.Fax = companyModel.Fax;
        company.WebSiteUrl = companyModel.WebSiteUrl;
        company.PatientDataModelId = companyModel.PatientDataModelId;

        return company;
    }
}