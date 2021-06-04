import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class PatientAdmissionView extends BaseEntityModel {
    Id: string;
    StartDate: any;
    PatientId: string;
    IsDelete: boolean;
    AppointmentId: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.StartDate = null;
        this.PatientId = "";
        this.AppointmentId = "";
    }

    createFromEntityModel(entity: any) {
        const newPatientAdmissionView =
            new PatientAdmissionView(entity.Id, !!entity.IsDelete);

        newPatientAdmissionView.PatientId = entity.PatientId;
        newPatientAdmissionView.AppointmentId = entity.AppointmentId;


        newPatientAdmissionView.StartDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.StartDate);

        return newPatientAdmissionView;
    }
}