
import { DateConverter } from "../helpers/dateConverter";
import { Employee } from "./employee";

export class EmployeeWithPermissionGroupView extends Employee {
    PermissionGroupName: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.PermissionGroupName = "";
    }

    createFromEntityModel(entity: any) {
        const newEmployeeWithPermissionGroup =
            new EmployeeWithPermissionGroupView(entity.Id, !!entity.isActive);

        newEmployeeWithPermissionGroup.FirstName = entity.FirstName;
        newEmployeeWithPermissionGroup.MiddleName = entity.MiddleName;
        newEmployeeWithPermissionGroup.LastName = entity.LastName;
        newEmployeeWithPermissionGroup.Address = entity.Address;
        newEmployeeWithPermissionGroup.SecondaryAddress = entity.SecondaryAddress;
        newEmployeeWithPermissionGroup.City = entity.City;
        newEmployeeWithPermissionGroup.State = entity.State;
        newEmployeeWithPermissionGroup.Zip = entity.Zip;
        newEmployeeWithPermissionGroup.PrimaryPhone = entity.PrimaryPhone;
        newEmployeeWithPermissionGroup.SecondaryPhone = entity.SecondaryPhone;
        newEmployeeWithPermissionGroup.EmployeeType = entity.EmployeeType;
        newEmployeeWithPermissionGroup.Gender = entity.Gender;
        newEmployeeWithPermissionGroup.Ssn = entity.Ssn;
        newEmployeeWithPermissionGroup.AppUserId = entity.AppUserId;
        newEmployeeWithPermissionGroup.CompanyId = entity.CompanyId;
        newEmployeeWithPermissionGroup.PermissionGroupName = entity.PermissionGroupName;
        newEmployeeWithPermissionGroup.NamePrefix = entity.NamePrefix;
        newEmployeeWithPermissionGroup.NameSuffix = entity.NameSuffix;

        newEmployeeWithPermissionGroup.DateOfBirth = DateConverter
            .sqlServerUtcDateToLocalJsDate(entity.DateOfBirth);

        return newEmployeeWithPermissionGroup;
    }
}