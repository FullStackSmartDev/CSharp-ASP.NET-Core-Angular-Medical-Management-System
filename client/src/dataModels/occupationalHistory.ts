import { BaseEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";

export class OccupationalHistory extends BaseEntityModel {
    PatientId: string;
    EmploymentStatus: string;
    OccupationalType: string;
    DisabilityClaimDetails: string;
    WorkersCompensationClaimDetails: string;
    CreatedDate: any;
    Start: any;
    End: any;



    constructor(id: string = "",
        isDelete: boolean = false, patientId: string = "") {

        super(id, isDelete);

        this.EmploymentStatus = "";
        this.OccupationalType = "";
        this.DisabilityClaimDetails = "";
        this.WorkersCompensationClaimDetails = "";
        this.PatientId = patientId;
        this.CreatedDate = new Date();
        this.Start = null;
        this.End = null;
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);

        this.Start = DateConverter
            .jsLocalDateToSqlServerUtc(this.Start);

        if (this.End) {
            this.End = DateConverter
                .jsLocalDateToSqlServerUtc(this.End);
        }
    }

    createFromEntityModel(entity: any) {
        const newOccupationalHistory
            = new OccupationalHistory(entity.Id, !!entity.IsDelete);

        newOccupationalHistory.EmploymentStatus = entity.EmploymentStatus;
        newOccupationalHistory.OccupationalType = entity.OccupationalType;
        newOccupationalHistory.DisabilityClaimDetails = entity.DisabilityClaimDetails;
        newOccupationalHistory.WorkersCompensationClaimDetails = entity.WorkersCompensationClaimDetails;
        newOccupationalHistory.PatientId = entity.PatientId;

        newOccupationalHistory.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        newOccupationalHistory.Start = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.Start);

        if (entity.End) {
            newOccupationalHistory.End = DateConverter
                .sqlServerUtcDateToLocalJsDate(entity.End);
        }


        return newOccupationalHistory;
    }
}