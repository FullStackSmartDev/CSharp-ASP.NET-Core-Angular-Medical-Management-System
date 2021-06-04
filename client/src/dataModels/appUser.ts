import { BaseEntityModel } from "./baseEntityModel";

export class AppUser extends BaseEntityModel {
    Hash: string;
    Login: string;
    IsSuperAdmin: boolean;
    EmployeeId: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);

        this.Hash = "";
        this.Login = "";
        this.IsSuperAdmin = false;
        this.EmployeeId = "";
    }

    createFromEntityModel(entity: any) {
        const appUser = new AppUser(entity.Id, !!entity.IsDelete);

        appUser.Hash = entity.Hash;
        appUser.Login = entity.Login;
        appUser.IsSuperAdmin = entity.IsSuperAdmin;
        appUser.EmployeeId = entity.EmployeeId;

        return appUser;
    }
}