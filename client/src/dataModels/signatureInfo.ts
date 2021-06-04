import { ConvertibleFromEntityModel } from "./baseEntityModel";
import { DateConverter } from "../helpers/dateConverter";
import { GuidHelper } from "../helpers/guidHelper";

export class SignatureInfo extends ConvertibleFromEntityModel {
    Id: string;
    EmployeeId: string;
    AdmissionId: string;
    SignDate: any;
    IsUnsigned: boolean;

    constructor() {
        super();
        this.Id = GuidHelper.generateNewGuid();
        this.EmployeeId = "";
        this.AdmissionId = "";
        this.SignDate = new Date();
        this.IsUnsigned = false;
    }

    convertToEntityModel() {
        this.SignDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.SignDate);
    }

    createFromEntityModel(entity: any) {
        const signatureInfo = new SignatureInfo();

        signatureInfo.Id = entity.Id;
        signatureInfo.EmployeeId = entity.EmployeeId;
        signatureInfo.AdmissionId = entity.AdmissionId;
        signatureInfo.IsUnsigned = !!entity.IsUnsigned;

        signatureInfo.SignDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.SignDate);

        return signatureInfo;
    }
}