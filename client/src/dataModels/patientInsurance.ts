
import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class PatientInsurance extends BaseEntityModel {
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
    Email: string;
    DateOfBirth: any;
    PatientDemographicId: string;
    CaseNumber: string;
    RqId: string;
    Ssn: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.CaseNumber = "";
        this.RqId = "";
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
        this.PatientDemographicId = "";
        this.Email = "";
    }

    convertToEntityModel() {
        this.DateOfBirth = DateConverter
            .jsLocalDateToSqlServerUtc(this.DateOfBirth);
    }

    createFromEntityModel(entity: any) {
        const newPatientInsurance = new PatientInsurance(entity.Id, !!entity.IsDelete);

        newPatientInsurance.FirstName = entity.FirstName;
        newPatientInsurance.MiddleName = entity.MiddleName;
        newPatientInsurance.LastName = entity.LastName;
        newPatientInsurance.PrimaryAddress = entity.PrimaryAddress;
        newPatientInsurance.SecondaryAddress = entity.SecondaryAddress;
        newPatientInsurance.City = entity.City;
        newPatientInsurance.State = entity.State;
        newPatientInsurance.Zip = entity.Zip;
        newPatientInsurance.PrimaryPhone = entity.PrimaryPhone;
        newPatientInsurance.SecondaryPhone = entity.SecondaryPhone;
        newPatientInsurance.Gender = entity.Gender;
        newPatientInsurance.Ssn = entity.Ssn;
        newPatientInsurance.PatientDemographicId = entity.PatientDemographicId;
        newPatientInsurance.Email = entity.Email;
        newPatientInsurance.CaseNumber = entity.CaseNumber;
        newPatientInsurance.RqId = entity.RqId;

        newPatientInsurance.DateOfBirth = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.DateOfBirth);

        return newPatientInsurance;
    }
}