
import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class PatientDemographic extends BaseEntityModel {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    PrimaryAddress: string;
    SecondaryAddress: string;
    City: string;
    State: number;
    Zip: string;
    PrimaryPhone: string;
    SecondaryPhone: string;
    Gender: number;
    MaritalStatus: number;
    Ssn: string;
    Email: string;
    DateOfBirth: any;
    PatientInsuranceId: string;
    CompanyId: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.FirstName = "";
        this.MiddleName = "";
        this.LastName = "";
        this.PrimaryAddress = "";
        this.SecondaryAddress = "";
        this.City = "";
        this.State = null;
        this.Zip = "";
        this.PrimaryPhone = "";
        this.SecondaryPhone = "";
        this.Gender = null;
        this.Ssn = "";
        this.DateOfBirth = null;
        this.MaritalStatus = null;
        this.PatientInsuranceId = "";
        this.Email = "";
        this.CompanyId = "";
    }

    convertToEntityModel() {
        this.DateOfBirth = DateConverter
            .jsLocalDateToSqlServerUtc(this.DateOfBirth);
    }

    createFromEntityModel(entity: any) {
        const newPatient = new PatientDemographic(entity.Id, !!entity.IsDelete);

        newPatient.FirstName = entity.FirstName;
        newPatient.MiddleName = entity.MiddleName;
        newPatient.LastName = entity.LastName;
        newPatient.PrimaryAddress = entity.PrimaryAddress;
        newPatient.SecondaryAddress = entity.SecondaryAddress;
        newPatient.City = entity.City;
        newPatient.State = entity.State;
        newPatient.Zip = entity.Zip;
        newPatient.PrimaryPhone = entity.PrimaryPhone;
        newPatient.SecondaryPhone = entity.SecondaryPhone;
        newPatient.Gender = entity.Gender;
        newPatient.Ssn = entity.Ssn;
        newPatient.PatientInsuranceId = entity.PatientInsuranceId;
        newPatient.MaritalStatus = entity.MaritalStatus;
        newPatient.CompanyId = entity.CompanyId;
        newPatient.Email = entity.Email;

        newPatient.DateOfBirth = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.DateOfBirth);

        return newPatient;
    }
}