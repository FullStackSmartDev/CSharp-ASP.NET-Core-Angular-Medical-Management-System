import { Injectable } from "@angular/core";
import { SqlTableView } from "../sqlTableView";
import { SqlSource } from "../sqlSource";
import { TemplateLookupItemCategory } from "../../../dataModels/templateLookupItemCategory";
import { TemplateLookupItem } from "../../../dataModels/templateLookupItem";
import { DataService } from "../../dataService";
import { SelectSqlStringProvider } from "../sqlQueryStringProviders/selectSqlStringProvider";
import { IcdCode } from "../../../dataModels/icdCode";
import { CptCode } from "../../../dataModels/cptCode";
import { Medication } from "../../../dataModels/medication";
import { AppointmentGridView } from "../../../dataModels/appointmentGridView";
import { PatientAdmissionView } from "../../../dataModels/patientAdmissionView";
import { ChiefComplaintKeywordsView } from "../../../dataModels/chiefComplaintKeywordsView";
import { TemplateLookupItemTracker } from "../../../dataModels/templateLookupItemTracker";
import { ExtraField } from "../../../dataModels/extraField";
import { EntityExtraFieldMap } from "../../../dataModels/entityExtraFieldMap";
import { Room } from "../../../dataModels/room";
import { Location } from '../../../dataModels/location';
import { AppUser } from "../../../dataModels/appUser";
import { EmployeeWithPermissionGroupView } from "../../../dataModels/employeeWithPermissionGroupView";
import { AppUserPermissionGroup } from "../../../dataModels/appUserPermissionGroup";

@Injectable()
export class TemplateLookupItemView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        const templateLookupItemSqlSource =
            SqlSource.createFromDataModel(new TemplateLookupItem());

        return templateLookupItemSqlSource
            .join(new TemplateLookupItemCategory(), "Id", "TemplateLookupItemCategoryId");
    }
}

@Injectable()
export class RoomView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        const roomSqlSource =
            SqlSource.createFromDataModel(new Room());

        return roomSqlSource
            .join(new Location(), "Id", "LocationId");
    }
}

@Injectable()
export class UserPermissionGroupView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        const permissionGroupSqlSource =
            SqlSource.createFromDataModel(new AppUserPermissionGroup());

        return permissionGroupSqlSource
            .join(new AppUser(), "Id", "AppUserId");
    }
}

@Injectable()
export class ExtraFieldView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        const extraFieldSqlSource =
            SqlSource.createFromDataModel(new ExtraField());

        return extraFieldSqlSource
            .join(new EntityExtraFieldMap(), "ExtraFieldId", "Id");
    }
}

@Injectable()
export class TemplateLookupItemTrackerView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        const templateLookupItemTrackerSqlSource =
            SqlSource.createFromDataModel(new TemplateLookupItemTracker());

        return templateLookupItemTrackerSqlSource
            .join(new TemplateLookupItem(), "Id", "TemplateLookupItemId");
    }
}

@Injectable()
export class CptCodeTableView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(new CptCode());
    }
}

@Injectable()
export class AppointmentSqlGridView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(new AppointmentGridView());
    }
}

@Injectable()
export class PatientAdmissionSqlView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(new PatientAdmissionView());
    }
}

@Injectable()
export class ChiefComplaintKeywordsSqlView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(new ChiefComplaintKeywordsView());
    }
}

@Injectable()
export class EmployeeWithPermissionGroupSqlView extends SqlTableView {
    constructor(dataService: DataService, selectSqlStringProvider: SelectSqlStringProvider) {
        super(dataService, selectSqlStringProvider);
    }

    get sqlSource(): SqlSource {
        return SqlSource.createFromDataModel(new EmployeeWithPermissionGroupView());
    }
}