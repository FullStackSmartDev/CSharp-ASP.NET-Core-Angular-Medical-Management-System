import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class AppointmentGridView extends BaseEntityModel {
    Id: string;
    StartDate: any;
    EndDate: any;
    AppointmentStatus: any;
    LocationName: string;
    LocationId: string;
    RoomId: string;
    RoomName: string;
    PatientId: string;
    PatientFirstName: string;
    PatientLastName: string;
    PatientDateOfBirth: any;
    PhysicianId: string;
    PhysicianFirstName: string;
    PhysicianLastName: string;
    NurseId: string;
    NurseFirstName: string;
    NurseLastName: string;
    IsDelete: boolean;
    Allegations: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.StartDate = null;
        this.EndDate = null;
        this.AppointmentStatus = null;
        this.LocationName = "";
        this.LocationId = "";
        this.RoomId = "";
        this.RoomName = "";
        this.PatientId = "";
        this.PatientFirstName = "";
        this.PatientLastName = "";
        this.PatientDateOfBirth = null;
        this.PhysicianId = "";
        this.PhysicianFirstName = "";
        this.PhysicianLastName = "";
        this.NurseId = "";
        this.NurseFirstName = "";
        this.NurseLastName = "";
        this.Allegations = "";
    }

    createFromEntityModel(entity: any) {
        const newAppointmentGridView = new AppointmentGridView(entity.Id, !!entity.IsDelete);

        newAppointmentGridView.AppointmentStatus = entity.AppointmentStatus;
        newAppointmentGridView.LocationName = entity.LocationName;
        newAppointmentGridView.LocationId = entity.LocationId;
        newAppointmentGridView.RoomId = entity.RoomId;
        newAppointmentGridView.RoomName = entity.RoomName;
        newAppointmentGridView.PatientId = entity.PatientId;
        newAppointmentGridView.PatientFirstName = entity.PatientFirstName;
        newAppointmentGridView.PatientLastName = entity.PatientLastName;
        newAppointmentGridView.PhysicianId = entity.PhysicianId;
        newAppointmentGridView.PhysicianFirstName = entity.PhysicianFirstName;
        newAppointmentGridView.PatientLastName = entity.PhysicianLastName;
        newAppointmentGridView.NurseId = entity.NurseId;
        newAppointmentGridView.NurseFirstName = entity.NurseFirstName;
        newAppointmentGridView.NurseLastName = entity.NurseLastName;
        newAppointmentGridView.Allegations = entity.Allegations;


        newAppointmentGridView.StartDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.StartDate);

        newAppointmentGridView.PatientDateOfBirth = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.PatientDateOfBirth);

        newAppointmentGridView.EndDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.EndDate);

        return newAppointmentGridView;
    }
}