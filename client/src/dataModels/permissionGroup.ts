import { BaseEntityModel } from "./baseEntityModel";

export class PermissionGroup extends BaseEntityModel {
    Name: string;
    Permissions: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Name = "";
        this.Permissions = "";
    }

    createFromEntityModel(entity: any) {
        const permissionGroup = new PermissionGroup(entity.Id, !!entity.IsDelete);

        permissionGroup.Name = entity.Name;
        permissionGroup.Permissions = entity.Permissions;

        return permissionGroup;
    }
}