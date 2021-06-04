import { GuidHelper } from "../helpers/guidHelper";

export abstract class ConvertibleFromEntityModel {
    abstract createFromEntityModel(entity: any): any;
}

export abstract class BaseEntityModel extends ConvertibleFromEntityModel {
    IsDelete: boolean;
    Id: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super();
        this.Id = id ? id : GuidHelper.generateNewGuid();
        this.IsDelete = isDelete;
    }
}

export abstract class BaseEntityActiveModel extends ConvertibleFromEntityModel {
    IsActive: boolean;
    Id: string;

    constructor(id: string = "", IsActive: boolean = true) {
        super();
        this.Id = id ? id : GuidHelper.generateNewGuid();
        this.IsActive = IsActive;
    }
}