import { BaseEntityModel } from "./baseEntityModel";

export class PatientAllegationsSet extends BaseEntityModel {
    Allegations: string;
    PeTemplates: any[];
    HpiTemplates: any[];
    RosTemplates: any[];
    SectionIds: any[];

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Allegations = "";
        this.PeTemplates = [];
        this.HpiTemplates = [];
        this.RosTemplates = [];
        this.SectionIds = [];
    }

    createFromEntityModel(entity: any) {
        const newPatientAllegation =
            new PatientAllegationsSet(entity.Id, !!entity.IsDelete);

        newPatientAllegation.Allegations = entity.Allegations;
        newPatientAllegation.PeTemplates = entity.PeTemplates;
        newPatientAllegation.HpiTemplates = entity.HpiTemplates;
        newPatientAllegation.RosTemplates = entity.RosTemplates;
        newPatientAllegation.SectionIds = entity.SectionIds;

        return newPatientAllegation;
    }
}