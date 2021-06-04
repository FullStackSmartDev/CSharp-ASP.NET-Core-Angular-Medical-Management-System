import { Injectable } from "@angular/core";
import { ReadCreateUpdateDataService } from "./readCreateUpdateDataService";
import { TemplateLookupItemCategory } from "../../../dataModels/templateLookupItemCategory";
import { SyncService } from "../../syncService";
import { TemplateLookupItem } from "../../../dataModels/templateLookupItem";
import { TemplateType } from "../../../dataModels/templateType";
import { Template } from "../../../dataModels/template";
import { TemplateTable, TemplateLookupItemCategoryTable, TemplateLookupItemTable, TemplateTypeTable, TobaccoHistoryTable, DrugHistoryTable, AlcoholHistoryTable, MedicalHistoryTable, SurgicalHistoryTable, FamilyHistoryTable, EducationHistoryTable, OccupationalHistoryTable, AllergyTable, MedicationHistoryTable, AppointmentTable, LocationTable, PatientDemographicTable, RoomTable, EmployeeTable, VitalSignsTable, BaseVitalSignsTable, PatientInsuranceTable, ChiefComplaintKeywordTable, ChiefComplaintRelatedKeywordTable, ChiefComplaintTable, ChiefComplaintTemplateTable, TemplateLookupItemTrackerTable, CompanyTable, ExtraFieldTable, EntityExtraFieldMapTable, AppUserTable, PermissionGroupTable, AppUserPermissionGroupTable, AdmissionTable, AddendumTable, MedicalRecordTable, SignatureInfoTable } from "../../sqlDataSource/table/tables";
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
export class CategoryDataService extends ReadCreateUpdateDataService<TemplateLookupItemCategory> {
    constructor(sqlTable: TemplateLookupItemCategoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class TemplateLookupItemDataService extends ReadCreateUpdateDataService<TemplateLookupItem> {
    constructor(sqlTable: TemplateLookupItemTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class TemplateTypeDataService extends ReadCreateUpdateDataService<TemplateType> {
    constructor(sqlTable: TemplateTypeTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class TemplateDataService extends ReadCreateUpdateDataService<Template> {
    constructor(sqlTable: TemplateTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class TobaccoHistoryDataService extends ReadCreateUpdateDataService<TobaccoHistory> {
    constructor(sqlTable: TobaccoHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class DrugHistoryDataService extends ReadCreateUpdateDataService<DrugHistory>{
    constructor(sqlTable: DrugHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AlcoholHistoryDataService extends ReadCreateUpdateDataService<AlcoholHistory>{
    constructor(sqlTable: AlcoholHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class MedicalHistoryDataService extends ReadCreateUpdateDataService<MedicalHistory>{
    constructor(sqlTable: MedicalHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class SurgicalHistoryDataService extends ReadCreateUpdateDataService<SurgicalHistory>{
    constructor(sqlTable: SurgicalHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class FamilyHistoryDataService extends ReadCreateUpdateDataService<FamilyHistory>{
    constructor(sqlTable: FamilyHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class EducationHistoryDataService extends ReadCreateUpdateDataService<EducationHistory>{
    constructor(sqlTable: EducationHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class OccupationalHistoryDataService extends ReadCreateUpdateDataService<OccupationalHistory>{
    constructor(sqlTable: OccupationalHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AllergyDataService extends ReadCreateUpdateDataService<Allergy>{
    constructor(sqlTable: AllergyTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class MedicationHistoryDataService extends ReadCreateUpdateDataService<MedicationHistory>{
    constructor(sqlTable: MedicationHistoryTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AppointmentDataService extends ReadCreateUpdateDataService<Appointment>{
    constructor(sqlTable: AppointmentTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class LocationDataService extends ReadCreateUpdateDataService<Location>{
    constructor(sqlTable: LocationTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class PatientDemographicDataService extends ReadCreateUpdateDataService<PatientDemographic>{
    constructor(sqlTable: PatientDemographicTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class RoomDataService extends ReadCreateUpdateDataService<Room>{
    constructor(sqlTable: RoomTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class EmployeeDataService extends ReadCreateUpdateDataService<Employee>{
    constructor(sqlTable: EmployeeTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class VitalSignsDataService extends ReadCreateUpdateDataService<VitalSigns>{
    constructor(sqlTable: VitalSignsTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class BaseVitalSignsDataService extends ReadCreateUpdateDataService<BaseVitalSigns>{
    constructor(sqlTable: BaseVitalSignsTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class PatientInsuranceDataService extends ReadCreateUpdateDataService<PatientInsurance>{
    constructor(sqlTable: PatientInsuranceTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class ChiefComplaintKeywordDataService extends ReadCreateUpdateDataService<ChiefComplaintKeyword>{
    constructor(sqlTable: ChiefComplaintKeywordTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class ChiefComplaintRelatedKeywordDataService extends ReadCreateUpdateDataService<ChiefComplaintRelatedKeyword>{
    constructor(sqlTable: ChiefComplaintRelatedKeywordTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class ChiefComplaintTemplateDataService extends ReadCreateUpdateDataService<ChiefComplaintTemplate>{
    constructor(sqlTable: ChiefComplaintTemplateTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class ChiefComplaintDataService extends ReadCreateUpdateDataService<ChiefComplaint>{
    constructor(sqlTable: ChiefComplaintTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class TemplateLookupItemTrackerDataService extends ReadCreateUpdateDataService<TemplateLookupItemTracker>{
    constructor(sqlTable: TemplateLookupItemTrackerTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class CompanyDataService extends ReadCreateUpdateDataService<Company>{
    constructor(sqlTable: CompanyTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class ExtraFieldDataService extends ReadCreateUpdateDataService<ExtraField>{
    constructor(sqlTable: ExtraFieldTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class EntityExtraFieldMapDataService extends ReadCreateUpdateDataService<EntityExtraFieldMap>{
    constructor(sqlTable: EntityExtraFieldMapTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AppUserDataService extends ReadCreateUpdateDataService<AppUser>{
    constructor(sqlTable: AppUserTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class PermissionGroupDataService extends ReadCreateUpdateDataService<PermissionGroup>{
    constructor(sqlTable: PermissionGroupTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AppUserPermissionGroupDataService extends ReadCreateUpdateDataService<AppUserPermissionGroup>{
    constructor(sqlTable: AppUserPermissionGroupTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AdmissionDataService extends ReadCreateUpdateDataService<Admission>{
    constructor(sqlTable: AdmissionTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class AddendumDataService extends ReadCreateUpdateDataService<Addendum>{
    constructor(sqlTable: AddendumTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class MedicalRecordDataService extends ReadCreateUpdateDataService<MedicalRecord>{
    constructor(sqlTable: MedicalRecordTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}

@Injectable()
export class SignatureInfoDataService extends ReadCreateUpdateDataService<SignatureInfo>{
    constructor(sqlTable: SignatureInfoTable, syncService: SyncService) {
        super(sqlTable, syncService);
    }
}