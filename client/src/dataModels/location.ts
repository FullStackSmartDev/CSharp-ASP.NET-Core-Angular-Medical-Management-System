import { BaseEntityActiveModel } from "./baseEntityModel";

export class Location extends BaseEntityActiveModel {
    CompanyId: string;
    Name: string;
    Address: string;
    City: string;
    State: string;
    Zip: string;
    Fax: string;
    Phone: string;
    SecondaryAddress: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.CompanyId = "";
        this.Name = "";
        this.Address = "";
        this.City = "";
        this.State = "";
        this.Zip = "";
        this.Fax = "";
        this.Phone = "";
        this.SecondaryAddress = "";
    }

    createFromEntityModel(entity: any) {
        const newLocation = new Location(entity.Id, !!entity.IsActive);

        newLocation.CompanyId = entity.CompanyId;
        newLocation.Name = entity.Name;
        newLocation.Address = entity.Address;
        newLocation.City = entity.City;
        newLocation.State = entity.State;
        newLocation.Zip = entity.Zip;
        newLocation.Fax = entity.Fax;
        newLocation.Phone = entity.Phone;
        newLocation.SecondaryAddress = entity.SecondaryAddress;

        return newLocation;
    }
}