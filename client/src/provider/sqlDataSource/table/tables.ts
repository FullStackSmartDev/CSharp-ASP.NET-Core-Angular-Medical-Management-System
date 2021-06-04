import { SqlTable } from "../sqlTable";
import { Injectable } from "@angular/core";
import { DataService } from "../../dataService";
import { InsertSqlStringProvider } from "../sqlQueryStringProviders/insertSqlStringProvider";
import { UpdateSqlStringProvider } from "../sqlQueryStringProviders/updateSqlStringProvider";
import { SelectSqlStringProvider } from "../sqlQueryStringProviders/selectSqlStringProvider";
import { TemplateLookupItemCategory } from "../../../dataModels/templateLookupItemCategory";
import { TemplateLookupItem } from "../../../dataModels/templateLookupItem";
import { TemplateType } from "../../../dataModels/templateType";
import { Template } from "../../../dataModels/template";
import { TobaccoHistory } from "../../../dataModels/TobaccoHistory";
import { DrugHistory } from "../../../dataModels/drugHistory";
import { AlcoholHistory } from "../../../dataModels/alcoholHistory";
import { MedicalHistory } from "../../../dataModels/medicalHistory";
import { SurgicalHistory } from "../../../dataModels/surgicalHistory";
import { FamilyHistory } from "../../../dataModels/familyHistory";
import { EducationHistory } from "../../../dataModels/educationHistory";
import { OccupationalHistory } from "../../../dataModels/occupationalHistory";
import { Allergy } from "../../../dataModels/allergy";
import { MedicationHistory } from "../../../dataModels/medicationHistory";
import { Appointment } from "../../../dataModels/appointment";
import { Location } from "../../../dataModels/location";
import { PatientDemographic } from "../../../dataModels/patientDemographic";
import { Room } from "../../../dataModels/room";
import { Employee } from "../../../dataModels/employee";
import { VitalSigns } from "../../../dataModels/vitalSigns";
import { BaseVitalSigns } from "../../../dataModels/baseVitalSigns";
import { PatientInsurance } from "../../../dataModels/patientInsurance";
import { ChiefComplaintKeyword } from "../../../dataModels/chiefComplaintKeyword";
import { ChiefComplaintRelatedKeyword } from "../../../dataModels/chiefComplaintRelatedKeyword";
import { ChiefComplaint } from "../../../dataModels/chiefComplaint";
import { ChiefComplaintTemplate } from "../../../dataModels/chiefComplaintTemplate";
import { TemplateLookupItemTracker } from "../../../dataModels/templateLookupItemTracker";
import { Company } from "../../../dataModels/company";
import { ExtraField } from "../../../dataModels/extraField";
import { EntityExtraFieldMap } from "../../../dataModels/entityExtraFieldMap";
import { AppUser } from "../../../dataModels/appUser";
import { PermissionGroup } from "../../../dataModels/permissionGroup";
import { AppUserPermissionGroup } from "../../../dataModels/appUserPermissionGroup";
import { Admission } from "../../../dataModels/admission";
import { Addendum } from "../../../dataModels/addendum";
import { MedicalRecord } from "../../../dataModels/medicalRecord";
import { SignatureInfo } from "../../../dataModels/signatureInfo";

@Injectable()
export class TemplateLookupItemCategoryTable extends SqlTable<TemplateLookupItemCategory> {

    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new TemplateLookupItemCategory());
    }
}

@Injectable()
export class TemplateLookupItemTable extends SqlTable<TemplateLookupItem> {

    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new TemplateLookupItem());
    }
}

@Injectable()
export class TemplateTypeTable extends SqlTable<TemplateType> {

    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new TemplateType());
    }
}

@Injectable()
export class TemplateTable extends SqlTable<Template> {

    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Template());
    }
}

@Injectable()
export class TobaccoHistoryTable extends SqlTable<TobaccoHistory> {

    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new TobaccoHistory());
    }
}

@Injectable()
export class DrugHistoryTable extends SqlTable<DrugHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new DrugHistory());
    }
}

@Injectable()
export class AlcoholHistoryTable extends SqlTable<AlcoholHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new AlcoholHistory());
    }
}

@Injectable()
export class MedicalHistoryTable extends SqlTable<MedicalHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new MedicalHistory());
    }
}

@Injectable()
export class SurgicalHistoryTable extends SqlTable<SurgicalHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new SurgicalHistory());
    }
}

@Injectable()
export class FamilyHistoryTable extends SqlTable<FamilyHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new FamilyHistory());
    }
}

@Injectable()
export class EducationHistoryTable extends SqlTable<EducationHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new EducationHistory());
    }
}

@Injectable()
export class OccupationalHistoryTable extends SqlTable<OccupationalHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new OccupationalHistory());
    }
}

@Injectable()
export class AllergyTable extends SqlTable<Allergy>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Allergy());
    }
}

@Injectable()
export class MedicationHistoryTable extends SqlTable<MedicationHistory>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new MedicationHistory());
    }
}

@Injectable()
export class AppointmentTable extends SqlTable<Appointment>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Appointment());
    }
}

@Injectable()
export class LocationTable extends SqlTable<Location>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Location());
    }
}

@Injectable()
export class PatientDemographicTable extends SqlTable<PatientDemographic>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new PatientDemographic());
    }
}

@Injectable()
export class RoomTable extends SqlTable<Room>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Room());
    }
}

@Injectable()
export class EmployeeTable extends SqlTable<Employee>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Employee());
    }
}

@Injectable()
export class VitalSignsTable extends SqlTable<VitalSigns>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new VitalSigns());
    }
}

@Injectable()
export class BaseVitalSignsTable extends SqlTable<BaseVitalSigns>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new BaseVitalSigns());
    }
}

@Injectable()
export class PatientInsuranceTable extends SqlTable<PatientInsurance>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new PatientInsurance());
    }
}

@Injectable()
export class ChiefComplaintKeywordTable extends SqlTable<ChiefComplaintKeyword>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new ChiefComplaintKeyword());
    }
}

@Injectable()
export class ChiefComplaintRelatedKeywordTable extends SqlTable<ChiefComplaintRelatedKeyword>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new ChiefComplaintRelatedKeyword());
    }
}

@Injectable()
export class ChiefComplaintTemplateTable extends SqlTable<ChiefComplaintTemplate>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new ChiefComplaintTemplate());
    }
}

@Injectable()
export class ChiefComplaintTable extends SqlTable<ChiefComplaint>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new ChiefComplaint());
    }
}

@Injectable()
export class TemplateLookupItemTrackerTable extends SqlTable<TemplateLookupItemTracker>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new TemplateLookupItemTracker());
    }
}


@Injectable()
export class CompanyTable extends SqlTable<Company>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Company());
    }
}

@Injectable()
export class ExtraFieldTable extends SqlTable<ExtraField>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new ExtraField());
    }
}

@Injectable()
export class EntityExtraFieldMapTable extends SqlTable<EntityExtraFieldMap>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new EntityExtraFieldMap());
    }
}

@Injectable()
export class AppUserTable extends SqlTable<AppUser>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new AppUser());
    }
}

@Injectable()
export class PermissionGroupTable extends SqlTable<PermissionGroup>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new PermissionGroup());
    }
}

@Injectable()
export class AppUserPermissionGroupTable extends SqlTable<AppUserPermissionGroup>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new AppUserPermissionGroup());
    }
}

@Injectable()
export class AdmissionTable extends SqlTable<Admission>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Admission());
    }
}

@Injectable()
export class AddendumTable extends SqlTable<Addendum>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new Addendum());
    }
}

@Injectable()
export class MedicalRecordTable extends SqlTable<MedicalRecord>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new MedicalRecord());
    }
}

@Injectable()
export class SignatureInfoTable extends SqlTable<SignatureInfo>{
    constructor(insertSqlStringProvider: InsertSqlStringProvider,
        updateSqlStringProvider: UpdateSqlStringProvider,
        selectSqlStringProvider: SelectSqlStringProvider, dataService: DataService) {

        super(insertSqlStringProvider,
            updateSqlStringProvider, selectSqlStringProvider,
            dataService, new SignatureInfo());
    }
}