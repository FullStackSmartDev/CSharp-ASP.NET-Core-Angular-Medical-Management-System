import { ConvertibleFromEntityModel } from "./baseEntityModel";

export class AppUserPermissionGroup extends ConvertibleFromEntityModel {
    AppUserId: string;
    PermissionGroupId: string;
    IsDelete: boolean;

    constructor(isDelete: boolean = false) {
        super();
        this.AppUserId = ""
        this.PermissionGroupId = "";
        this.IsDelete = isDelete;
    }

    createFromEntityModel(entity: any) {
        const appUserPermissionGroup = new AppUserPermissionGroup(!!entity.isDelete);

        appUserPermissionGroup.PermissionGroupId = entity.PermissionGroupId;
        appUserPermissionGroup.AppUserId = entity.AppUserId;

        return appUserPermissionGroup;
    }
}