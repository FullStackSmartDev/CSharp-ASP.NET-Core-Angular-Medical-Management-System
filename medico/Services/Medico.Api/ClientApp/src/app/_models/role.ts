export enum Role {
    Physician = "Physician",
    Nurse = "Nurse",
    MedicalAssistant = "MedicalAssistant",
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
}

export class RouteRoles {
    static appointments: Role[] = [Role.SuperAdmin, Role.Physician, Role.Nurse, Role.Admin];
    static patientsManagement: Role[] = [Role.SuperAdmin, Role.Physician, Role.Nurse, Role.Admin];
    static administration: Role[] = [Role.SuperAdmin, Role.Admin];
    static companiesManagement: Role[] = [Role.SuperAdmin];
    static libraryManagement: Role[] = [Role.SuperAdmin];
    static patientChart: Role[] = [Role.SuperAdmin, Role.Physician, Role.Nurse, Role.Admin];
}