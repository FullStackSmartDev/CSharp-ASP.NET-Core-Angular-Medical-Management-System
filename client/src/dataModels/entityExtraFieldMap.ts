import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class EntityExtraFieldMap extends ConvertibleFromEntityModel {
    EntityId: string;
    ExtraFieldId: string;
    Value: string;

    constructor() {
        super();
        this.EntityId = ""
        this.ExtraFieldId = "";
        this.Value = "";
    }

    createFromEntityModel(entityExtraFieldMapModel: any) {
        const entityExtraFieldMap = new EntityExtraFieldMap();

        entityExtraFieldMap.EntityId = entityExtraFieldMapModel.EntityId;
        entityExtraFieldMap.ExtraFieldId = entityExtraFieldMapModel.ExtraFieldId;
        entityExtraFieldMap.Value = entityExtraFieldMapModel.Value;

        return entityExtraFieldMap;
    }
}