import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class Appointment extends BaseEntityModel {
    AppointmentStatus: string;
    PatientDemographicId: string;
    LocationId: string;
    PhysicianId: string;
    NurseId: string;
    RoomId: string;
    StartDate: any;
    EndDate: any;
    AdmissionId: string;
    CompanyId: string;
    Allegations: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.AppointmentStatus = "";
        this.LocationId = "";
        this.PhysicianId = "";
        this.NurseId = "";
        this.RoomId = "";
        this.PatientDemographicId = "";
        this.AdmissionId = null;
        this.StartDate = null;
        this.EndDate = null;
        this.CompanyId = "";
        this.Allegations = "";
    }

    convertToEntityModel() {
        this.StartDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.StartDate);

        this.EndDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.EndDate);
    }

    createFromEntityModel(entity: any) {
        const newAppointment = new Appointment(entity.Id, !!entity.IsDelete);

        newAppointment.AppointmentStatus = entity.AppointmentStatus;
        newAppointment.LocationId = entity.LocationId;
        newAppointment.PhysicianId = entity.PhysicianId;
        newAppointment.NurseId = entity.NurseId;
        newAppointment.RoomId = entity.RoomId;
        newAppointment.PatientDemographicId = entity.PatientDemographicId;
        newAppointment.AdmissionId = entity.AdmissionId;
        newAppointment.CompanyId = entity.CompanyId;
        newAppointment.Allegations = entity.Allegations;

        newAppointment.StartDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.StartDate);

        newAppointment.EndDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.EndDate);

        return newAppointment;
    }
}