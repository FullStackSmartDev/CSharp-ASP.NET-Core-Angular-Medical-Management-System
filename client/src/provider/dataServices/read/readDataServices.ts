import { Injectable } from "@angular/core";
import { ReadDataService } from "./readDataService";
import { TemplateLookupItemView, CptCodeTableView, AppointmentSqlGridView, PatientAdmissionSqlView, ChiefComplaintKeywordsSqlView, TemplateLookupItemTrackerView, ExtraFieldView, RoomView, UserPermissionGroupView, EmployeeWithPermissionGroupSqlView } from "../../sqlDataSource/view/views";

@Injectable()
export class TemplateLookupItemViewDataService extends ReadDataService {
    constructor(templateLookupItemView: TemplateLookupItemView) {
        super(templateLookupItemView);
    }
}

@Injectable()
export class ExtraFieldViewDataService extends ReadDataService {
    constructor(extraFieldView: ExtraFieldView) {
        super(extraFieldView);
    }
}

@Injectable()
export class TemplateLookupItemTrackerViewDataService extends ReadDataService {
    constructor(templateLookupItemView: TemplateLookupItemTrackerView) {
        super(templateLookupItemView);
    }
}

@Injectable()
export class CptCodeReadDataService extends ReadDataService {
    constructor(cptCodeTableView: CptCodeTableView) {
        super(cptCodeTableView);
    }
}

@Injectable()
export class AppointmentGridViewDataService extends ReadDataService {
    constructor(appointmentSqlGridView: AppointmentSqlGridView) {
        super(appointmentSqlGridView);
    }
}

@Injectable()
export class PatientAdmissionViewDataService extends ReadDataService {
    constructor(patientAdmissionSqlView: PatientAdmissionSqlView) {
        super(patientAdmissionSqlView);
    }
}

@Injectable()
export class ChiefComplaintKeywordsViewDataService extends ReadDataService {
    constructor(chiefComplaintKeywordsView: ChiefComplaintKeywordsSqlView) {
        super(chiefComplaintKeywordsView);
    }
}

@Injectable()
export class RoomViewDataService extends ReadDataService {
    constructor(roomView: RoomView) {
        super(roomView);
    }
}

@Injectable()
export class UserPermissionGroupViewDataService extends ReadDataService {
    constructor(userPermissionGroupView: UserPermissionGroupView) {
        super(userPermissionGroupView);
    }
}

@Injectable()
export class EmployeeWithPermissionGroupViewDataService extends ReadDataService {
    constructor(employeeWithPermissionGroupSqlView: EmployeeWithPermissionGroupSqlView) {
        super(employeeWithPermissionGroupSqlView);
    }
}