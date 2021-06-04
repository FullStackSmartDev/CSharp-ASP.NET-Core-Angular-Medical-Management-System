import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class Admission extends BaseEntityModel {
    AppointmentId: string;
    PatientDemographicId: string;
    AdmissionData: string;
    CreatedDate: any;


    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.AppointmentId = "";
        this.PatientDemographicId = "";
        this.AdmissionData = "";
        this.CreatedDate = null;
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const newAdmission = new Admission(entity.Id, !!entity.IsDelete);

        newAdmission.AppointmentId = entity.AppointmentId;
        newAdmission.PatientDemographicId = entity.PatientDemographicId;
        newAdmission.AdmissionData = entity.AdmissionData;

        newAdmission.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        return newAdmission;
    }
}