import { ConvertibleFromEntityModel } from "./baseEntityModel";
import { GuidHelper } from "../helpers/guidHelper";
import { DateConverter } from "../helpers/dateConverter";

export class Addendum extends ConvertibleFromEntityModel {
    Id: string;
    Description: string;
    CreatedDate: any;
    AdmissionId: string;

    constructor(id: string = "") {
        super();
        this.Id = id ? id : GuidHelper.generateNewGuid();
        this.Description = "";
        this.AdmissionId = "";
        this.CreatedDate = new Date();
    }

    convertToEntityModel() {
        this.CreatedDate = DateConverter
            .jsLocalDateToSqlServerUtc(this.CreatedDate);
    }

    createFromEntityModel(entity: any) {
        const addendum = new Addendum(entity.Id);

        addendum.Description = entity.Description;
        addendum.AdmissionId = entity.AdmissionId;
        addendum.CreatedDate = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.CreatedDate);

        return addendum;
    }
}