import { DateConverter } from "../helpers/dateConverter";
import { BaseEntityActiveModel } from "./baseEntityModel";

export class Employee extends BaseEntityActiveModel {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    SecondaryAddress: string;
    City: string;
    State: string;
    Zip: string;
    PrimaryPhone: string;
    SecondaryPhone: string;
    EmployeeType: number;
    Gender: number;
    Ssn: string;
    DateOfBirth: any;
    AppUserId: string;
    CompanyId: string;
    NamePrefix: string;
    NameSuffix: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.FirstName = "";
        this.MiddleName = "";
        this.LastName = "";
        this.Address = "";
        this.SecondaryAddress = "";
        this.City = "";
        this.State = "";
        this.Zip = "";
        this.PrimaryPhone = "";
        this.SecondaryPhone = "";
        this.EmployeeType = null;
        this.Gender = null;
        this.Ssn = "";
        this.DateOfBirth = null;
        this.AppUserId = "";
        this.CompanyId = "";
        this.NamePrefix = "";
        this.NameSuffix = "";
    }

    convertToEntityModel() {
        this.DateOfBirth = DateConverter
            .jsLocalDateToSqlServerUtc(this.DateOfBirth);
    }

    createFromEntityModel(entity: any) {
        const newEmployee = new Employee(entity.Id, !!entity.IsActive);

        newEmployee.FirstName = entity.FirstName;
        newEmployee.MiddleName = entity.MiddleName;
        newEmployee.LastName = entity.LastName;
        newEmployee.Address = entity.Address;
        newEmployee.SecondaryAddress = entity.SecondaryAddress;
        newEmployee.City = entity.City;
        newEmployee.State = entity.State;
        newEmployee.Zip = entity.Zip;
        newEmployee.PrimaryPhone = entity.PrimaryPhone;
        newEmployee.SecondaryPhone = entity.SecondaryPhone;
        newEmployee.EmployeeType = entity.EmployeeType;
        newEmployee.Gender = entity.Gender;
        newEmployee.Ssn = entity.Ssn;
        newEmployee.AppUserId = entity.AppUserId;
        newEmployee.CompanyId = entity.CompanyId;
        newEmployee.NameSuffix = entity.NameSuffix;
        newEmployee.NamePrefix = entity.NamePrefix;

        newEmployee.DateOfBirth = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.DateOfBirth);

        return newEmployee;
    }
}