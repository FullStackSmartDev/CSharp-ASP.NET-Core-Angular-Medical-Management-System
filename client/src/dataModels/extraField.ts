import { BaseEntityActiveModel } from "./baseEntityModel";
import { ExtraFieldType } from "../enums/extraFieldType";

export class ExtraField extends BaseEntityActiveModel {
    RelatedEntityName: string;
    Name: string;
    Title: string;
    Type: ExtraFieldType;
    ShowInList: boolean;


    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.RelatedEntityName = "";
        this.Name = "";
        this.Title = "";
        this.Type = ExtraFieldType.TextBox;
        this.ShowInList = true;
    }

    createFromEntityModel(extraFieldModel: any) {
        const extraField =
            new ExtraField(extraFieldModel.Id, !!extraFieldModel.IsActive);

        extraField.Name = extraFieldModel.Name;
        extraField.Title = extraFieldModel.Title;
        extraField.RelatedEntityName = extraFieldModel.RelatedEntityName;
        extraField.Type = extraFieldModel.Type;
        extraField.ShowInList = extraFieldModel.ShowInList;

        return extraField;
    }
}