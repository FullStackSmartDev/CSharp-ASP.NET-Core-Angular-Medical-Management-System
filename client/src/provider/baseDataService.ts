import { TypeHelper } from "../helpers/typeHelper";
import { DateConverter } from "../helpers/dateConverter";
import { TableNames } from "../constants/tableNames";
import { SqlColumnLength } from "../constants/sqlColumnLength";

export abstract class BaseDataService {
    protected dbName: string = "Medico";
    protected dbDescription: string = "Medico db";
    protected dbSize: number = 100 * 1024 * 1024;

    protected companyId: string = "EC3A7738-0E2A-4045-8841-420D9F14BECF";

    protected createTableScripts: Array<any> = [
        {
            name: TableNames.tobaccoHistory,
            createScript:
                `CREATE TABLE IF NOT EXISTS ${TableNames.tobaccoHistory} (
                    IsDelete INT NOT NULL DEFAULT 0,
                    Id uniqueidentifier NOT NULL,
                    Amount int NULL,
                    Length int NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Quit INT NULL,
                    Status nvarchar NULL,
                    Type nvarchar NULL,
                    Use nvarchar NULL,
                    Frequency nvarchar NULL,
                    Duration nvarchar NULL,
                    StatusLength int NULL,
                    Notes nvarchar NULL,
                    CreateDate date NOT NULL,
                    StatusLengthType nvarchar NULL)`
        },
        {
            name: TableNames.alcoholHistory,
            createScript:
                `CREATE TABLE IF NOT EXISTS ${TableNames.alcoholHistory} (
                    IsDelete INT NOT NULL DEFAULT 0,
                    Id uniqueidentifier NOT NULL,
                    Amount int NULL,
                    Length int NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Quit INT NULL,
                    Status nvarchar(${SqlColumnLength.short}) NULL,
                    Type nvarchar(${SqlColumnLength.short}) NULL,
                    Use nvarchar(${SqlColumnLength.short}) NULL,
                    Frequency nvarchar(${SqlColumnLength.short}) NULL,
                    Duration nvarchar(${SqlColumnLength.short}) NULL,
                    StatusLength int NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL,
                    StatusLengthType nvarchar(${SqlColumnLength.short}) NULL,
                    CreateDate date NOT NULL)`
        },
        {
            name: TableNames.drugHistory,
            createScript:
                `CREATE TABLE IF NOT EXISTS ${TableNames.drugHistory} (
                    IsDelete INT NOT NULL DEFAULT 0,
                    Id uniqueidentifier NOT NULL,
                    Amount int NULL,
                    Length int NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Quit INT NULL,
                    Status nvarchar(${SqlColumnLength.short}) NULL,
                    Type nvarchar(${SqlColumnLength.short}) NULL,
                    Use nvarchar(${SqlColumnLength.short}) NULL,
                    Frequency nvarchar(${SqlColumnLength.short}) NULL,
                    Duration nvarchar(${SqlColumnLength.short}) NULL,
                    StatusLength int NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL,
                    StatusLengthType nvarchar(${SqlColumnLength.short}) NULL,
                    Route nvarchar(${SqlColumnLength.short}) NULL,
                    CreateDate date NOT NULL)`
        },
        {
            name: TableNames.company,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.company} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Name nvarchar NOT NULL,
                    Address nvarchar NOT NULL,
                    SecondaryAddress nvarchar NOT NULL,
                    City nvarchar NOT NULL,
                    State nvarchar NOT NULL,
                    ZipCode nvarchar NOT NULL,
                    Phone nvarchar NOT NULL,
                    Fax nvarchar NOT NULL,
                    PatientDataModelId uniqueidentifier NULL,
                    WebSiteUrl nvarchar(200) NULL);`
        },
        {
            name: TableNames.patientDemographic,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.patientDemographic} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    CompanyId uniqueidentifier NOT NULL,
                    MaritalStatus int NOT NULL,
                    Ssn nvarchar(100) NOT NULL,
                    FirstName nvarchar(100) NOT NULL,
                    LastName nvarchar(100) NOT NULL,
                    Gender int NOT NULL,
                    DateOfBirth date NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    City nvarchar(100) NOT NULL,
                    Email nvarchar(100) NOT NULL,
                    MiddleName nvarchar NULL,
                    PatientInsuranceId uniqueidentifier NULL,
                    PrimaryAddress nvarchar(400) NOT NULL,
                    PrimaryPhone nvarchar(100) NOT NULL,
                    SecondaryAddress nvarchar(400) NULL,
                    SecondaryPhone nvarchar(100) NULL,
                    State int NOT NULL,
                    Zip nvarchar(50) NOT NULL)`
        },
        {
            name: TableNames.patientInsurance,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.patientInsurance} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    Ssn nvarchar(100) NOT NULL,
                    FirstName nvarchar(100) NOT NULL,
                    LastName nvarchar(100) NOT NULL,
                    Gender int NOT NULL,
                    DateOfBirth date NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    City nvarchar(100) NOT NULL,
                    Email nvarchar(100) NOT NULL,
                    MiddleName nvarchar NULL,
                    PatientDemographicId uniqueidentifier NOT NULL,
                    PrimaryAddress nvarchar(400) NOT NULL,
                    PrimaryPhone nvarchar(100) NOT NULL,
                    SecondaryAddress nvarchar(400) NULL,
                    SecondaryPhone nvarchar(100) NULL,
                    State int NOT NULL, 
                    CaseNumber nvarchar(100) NULL,
                    RqId nvarchar(100) NULL,
                    Zip nvarchar(50) NOT NULL)`
        },
        {
            name: TableNames.admission,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.admission} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    PatientDemographicId uniqueidentifier NOT NULL,
                    AppointmentId uniqueidentifier NOT NULL,
                    AdmissionData nvarchar NOT NULL,
                    CreatedDate date NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.signatureInfo,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.signatureInfo} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
	                EmployeeId uniqueidentifier NOT NULL,
	                AdmissionId uniqueidentifier NOT NULL,
	                SignDate date NOT NULL,
	                IsUnsigned INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.appointment,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.appointment} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    CompanyId uniqueidentifier NOT NULL,
                    PatientDemographicId uniqueidentifier NOT NULL,
                    PhysicianId uniqueidentifier NOT NULL,
                    NurseId uniqueidentifier NOT NULL,
                    RoomId uniqueidentifier NOT NULL,
                    StartDate date NOT NULL,
                    EndDate date NOT NULL,
                    AppointmentStatus nvarchar(200) NOT NULL,
                    LocationId uniqueidentifier NOT NULL,
                    AdmissionId uniqueidentifier NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Allegations nvarchar(2000) NULL)`
        },
        {
            name: TableNames.cptCode,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.cptCode} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Code nvarchar NOT NULL,
                    Name nvarchar NOT NULL,
                    Description nvarchar NOT NULL)`
        },
        {
            name: TableNames.employee,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.employee} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    AppUserId uniqueidentifier NOT NULL,
                    CompanyId uniqueidentifier NOT NULL,
                    FirstName nvarchar(100) NOT NULL,
                    MiddleName nvarchar(100) NULL,
                    LastName nvarchar(100) NOT NULL,
                    Address nvarchar(200) NOT NULL,
                    SecondaryAddress nvarchar(200) NULL,
                    City nvarchar(100) NOT NULL,
                    Zip nvarchar(100) NOT NULL,
                    PrimaryPhone nvarchar(100) NOT NULL,
                    SecondaryPhone nvarchar(100) NULL,
                    EmployeeType int NOT NULL,
                    Ssn nvarchar(100) NOT NULL,
                    Gender int NOT NULL,
                    DateOfBirth date NOT NULL,
                    State nvarchar(100),
                    IsActive INT NOT NULL DEFAULT 1,
                    NamePrefix nvarchar(100) NULL,
	                NameSuffix nvarchar(100) NULL)`
        },
        {
            name: TableNames.location,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.location} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    CompanyId uniqueidentifier NOT NULL,
                    Name nvarchar(100) NOT NULL,
                    Address nvarchar(200) NOT NULL,
                    City nvarchar(100) NOT NULL,
                    State nvarchar(100) NOT NULL,
                    Zip nvarchar(100) NOT NULL,
                    Fax nvarchar(100) NOT NULL,
                    Phone nvarchar(100) NOT NULL,
                    SecondaryAddress nvarchar(200) NULL,
                    IsActive INT NOT NULL DEFAULT 1)`
        },
        {
            name: TableNames.patientDataModel,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.patientDataModel} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    CompanyId uniqueidentifier NULL,
                    JsonPatientDataModel nvarchar NOT NULL)`
        },
        {
            name: TableNames.room,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.room} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    LocationId uniqueidentifier NOT NULL,
                    Name nvarchar NULL,
                    IsActive INT NOT NULL DEFAULT 1)`
        },
        {
            name: TableNames.templateLookupItemCategory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.templateLookupItemCategory} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    Title nvarchar(200),
                    Name nvarchar(100) NOT NULL,
                    IsActive INT NOT NULL DEFAULT 1)`
        },
        {
            name: TableNames.templateLookupItem,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.templateLookupItem} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    Name nvarchar(100) NOT NULL,
                    JsonValues nvarchar NOT NULL,
                    TemplateLookupItemCategoryId uniqueidentifier NOT NULL,
                    CompanyId uniqueidentifier NULL, 
                    Title nvarchar(200),
                    IsActive INT NOT NULL DEFAULT 1)`
        },
        {
            name: TableNames.chiefComplaint,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.chiefComplaint} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    CompanyId uniqueidentifier NULL,
                    Name nvarchar(200) NOT NULL,
                    Title nvarchar(100) NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.template,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.template} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    TemplateOrder int NULL,
                    Name nvarchar NOT NULL,
                    Title nvarchar(200),
                    CompanyId uniqueidentifier NULL,
                    IsActive INT NOT NULL DEFAULT 1,
                    IsHistorical INT NOT NULL DEFAULT 0,
                    IsRequired INT NOT NULL DEFAULT 0,
                    Value nvarchar NOT NULL,
                    TemplateTypeId uniqueidentifier NOT NULL,
                    DetailedTemplateHtml nvarchar NULL,
                    DefaultTemplateHtml nvarchar NULL,
                    ReportTitle nvarchar(2000) NOT NULL)`
        },
        {
            name: TableNames.templateType,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.templateType} (
                    Id uniqueidentifier PRIMARY KEY NOT NULL,
                    IsActive INT NOT NULL DEFAULT 1,
                    CompanyId uniqueidentifier NULL,
                    Name nvarchar(100) NOT NULL,
                    Title nvarchar NULL)`
        },
        {
            name: TableNames.chiefComplaintTemplate,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.chiefComplaintTemplate} (
                    ChiefComplaintId uniqueidentifier NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    TemplateId uniqueidentifier NOT NULL)`
        },
        {
            name: TableNames.medicalHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.medicalHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Notes nvarchar(${SqlColumnLength.long}) NULL,
                    CreatedDate date NOT NULL,
                    Diagnosis nvarchar(${SqlColumnLength.long}) NOT NULL,
                    PatientId uniqueidentifier NOT NULL)`
        },
        {
            name: TableNames.medicalRecord,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.medicalRecord} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Notes nvarchar(${SqlColumnLength.long}) NULL,
                    CreatedDate date NOT NULL,
                    Diagnosis nvarchar(${SqlColumnLength.long}) NOT NULL,
                    PatientId uniqueidentifier NOT NULL)`
        },
        {
            name: TableNames.surgicalHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.surgicalHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Notes nvarchar(${SqlColumnLength.long}) NULL,
                    CreatedDate date NOT NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Diagnosis nvarchar(${SqlColumnLength.long}) NOT NULL)`
        },
        {
            name: TableNames.familyHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.familyHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    FamilyMember nvarchar(${SqlColumnLength.short}) NOT NULL,
                    FamilyStatus nvarchar(${SqlColumnLength.short}) NOT NULL,
                    CreatedDate date NOT NULL,
                    Diagnosis nvarchar(${SqlColumnLength.short}),
                    PatientId uniqueidentifier NOT NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL)`
        },
        {
            name: TableNames.educationHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.educationHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Degree nvarchar(${SqlColumnLength.long}) NOT NULL,
                    YearCompleted int NOT NULL,
                    CreatedDate date NOT NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL)`
        },
        {
            name: TableNames.occupationalHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.occupationalHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    OccupationalType nvarchar(${SqlColumnLength.long}) NOT NULL,
                    Start date NOT NULL,
                    End date NULL,
                    DisabilityClaimDetails nvarchar(${SqlColumnLength.long}) NULL,
                    WorkersCompensationClaimDetails nvarchar(${SqlColumnLength.long}) NULL,
                    EmploymentStatus nvarchar(${SqlColumnLength.short}) NOT NULL,
                    CreatedDate date NOT NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL)`
        },
        {
            name: TableNames.allergy,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.allergy} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    CreatedDate date NOT NULL,
                    Notes nvarchar NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Reaction nvarchar(200) NOT NULL,
                    Medication nvarchar(400) NOT NULL)`
        },
        {
            name: TableNames.medicationHistory,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.medicationHistory} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    CreatedDate date NOT NULL,
                    Medication nvarchar(${SqlColumnLength.long}) NOT NULL,
                    PatientId uniqueidentifier NOT NULL,
                    Dose int NULL,
                    Units nvarchar(${SqlColumnLength.short}) NULL,
                    DoseSchedule nvarchar(${SqlColumnLength.short}) NULL,
                    Route nvarchar(${SqlColumnLength.short}) NULL,
                    Prn int NULL,
                    MedicationStatus nvarchar(${SqlColumnLength.short}) NULL,
                    Notes nvarchar(${SqlColumnLength.long}) NULL )`
        },
        {
            name: TableNames.appUser,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.appUser} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    EmployeeId uniqueidentifier NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Hash nvarchar(2000) NOT NULL,
                    Login nvarchar(200) NOT NULL,
                    IsSuperAdmin INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.permissionGroup,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.permissionGroup} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Name nvarchar(200) NOT NULL,
                    Permissions nvarchar(2000) NOT NULL)`
        },
        {
            name: TableNames.appUserPermissionGroup,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.appUserPermissionGroup} (
                    AppUserId uniqueidentifier NOT NULL,
                    PermissionGroupId uniqueidentifier NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.extraField,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.extraField} (
                    Id uniqueidentifier NOT NULL PRIMARY KEY,
                    IsActive INT NOT NULL DEFAULT 1,
                    ShowInList INT NOT NULL DEFAULT 1,
                    RelatedEntityName nvarchar(200) NOT NULL,
                    Type int NOT NULL,
                    Name nvarchar(200) NOT NULL,
                    Title nvarchar(200) NOT NULL)`
        },
        {
            name: TableNames.entityExtraFieldMap,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.entityExtraFieldMap} (
                    EntityId uniqueidentifier NOT NULL,
                    ExtraFieldId uniqueidentifier NOT NULL,
                    Value nvarchar NOT NULL)`
        },
        {
            name: TableNames.chiefComplaintKeyword,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.chiefComplaintKeyword} (
                    Id uniqueidentifier NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0,
                    Value nvarchar(400))`
        },
        {
            name: TableNames.templateLookupItemTracker,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.templateLookupItemTracker} (
                    TemplateId uniqueidentifier NOT NULL,
                    TemplateLookupItemId uniqueidentifier NOT NULL,
                    NumberOfLookupItemsInTemplate int NOT NULL)`
        },
        {
            name: TableNames.chiefComplaintRelatedKeyword,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.chiefComplaintRelatedKeyword} (
                    ChiefComplaintId uniqueidentifier NOT NULL,
                    KeywordId uniqueidentifier NOT NULL,
                    IsDelete INT NOT NULL DEFAULT 0)`
        },
        {
            name: TableNames.appointmentGridView,
            createScript: `
                CREATE VIEW IF NOT EXISTS ${TableNames.appointmentGridView} AS
                SELECT a.Id, a.IsDelete, a.Allegations, a.StartDate, a.EndDate, a.AppointmentStatus, l.Name AS LocationName, l.Id AS LocationId, r.Id AS RoomId, r.Name AS RoomName, p.Id AS PatientId, p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.DateOfBirth AS PatientDateOfBirth, ph.Id AS PhysicianId, ph.FirstName AS PhysicianFirstName, ph.LastName AS PhysicianLastName, n.Id AS NurseId, n.FirstName AS NurseFirstName, n.LastName AS NurseLastName FROM Appointment AS a 
                JOIN Location AS l ON l.Id = a.LocationId 
                JOIN PatientDemographic AS p ON p.Id = a.PatientDemographicId 
                JOIN Employee AS ph ON ph.Id = a.PhysicianId 
                JOIN Employee AS n ON n.Id = a.NurseId 
                JOIN Room AS r on r.Id = a.RoomId`
        },
        {
            name: TableNames.patientAdmissionView,
            createScript: `
                CREATE VIEW IF NOT EXISTS ${TableNames.patientAdmissionView} AS
                SELECT ad.Id, ad.IsDelete, ap.Id AS AppointmentId, ap.PatientDemographicId AS PatientId, ap.StartDate FROM ${TableNames.appointment} AS ap
                LEFT JOIN Admission AS ad ON ad.AppointmentId = ap.Id`
        },
        {
            name: TableNames.employeeWithPermissionGroupView,
            createScript: `
                CREATE VIEW IF NOT EXISTS ${TableNames.employeeWithPermissionGroupView} AS
                SELECT e.Id, e.AppUserId, e.NamePrefix, e.NameSuffix, e.CompanyId, e.IsActive, e.Ssn, e.DateOfBirth, e.Gender, e.FirstName, e.LastName, e.MiddleName, e.Address, e.SecondaryAddress, e.City, e.State, e.Zip, e.PrimaryPhone, e.SecondaryPhone, e.EmployeeType, u.Login, g.Name AS PermissionGroupName FROM Employee AS e 
                JOIN AppUser AS u ON u.Id = e.AppUserId
                JOIN AppUserPermissionGroup AS pg ON pg.AppUserId = u.Id
                JOIN PermissionGroup AS g ON g.Id = pg.PermissionGroupId`
        },
        {
            name: TableNames.chiefComplaintKeywordsView,
            createScript: `
                CREATE VIEW IF NOT EXISTS ${TableNames.chiefComplaintKeywordsView} AS
                SELECT cc.Id, cc.Title, cc.IsDelete, cck.Value AS Keyword FROM ${TableNames.chiefComplaint} AS cc
                LEFT JOIN ${TableNames.chiefComplaintRelatedKeyword} AS ccrk ON ccrk.ChiefComplaintId = cc.Id
                LEFT JOIN ${TableNames.chiefComplaintKeyword} AS cck ON cck.Id = ccrk.KeywordId
                WHERE cc.IsDelete = 0`
        },
        {
            name: TableNames.vitalSigns,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.vitalSigns} (
                    IsDelete int NOT NULL,
	                Id uniqueidentifier NOT NULL,
	                PatientId uniqueidentifier NOT NULL,
	                Pulse float NULL,
	                SystolicBloodPressure float NULL,
	                DiastolicBloodPressure float NULL,
	                BloodPressurePosition nvarchar(100) NULL,
	                BloodPressureLocation nvarchar(100) NULL,
	                OxygenSaturationAtRest nvarchar(100) NULL,
	                OxygenSaturationAtRestValue float NULL,
	                RespirationRate int NULL,
                    CreateDate date NOT NULL,
                    AdmissionId uniqueidentifier NULL)`
        },
        {
            name: TableNames.baseVitalSigns,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.baseVitalSigns} (
                    IsDelete int NOT NULL,
	                Id uniqueidentifier NOT NULL,
	                PatientId uniqueidentifier NOT NULL,
	                DominantHand nvarchar(100) NULL,
	                Weight float NULL,
	                Height float NULL,
	                LeftBicep float NULL,
	                RightBicep float NULL,
	                LeftForearm float NULL,
	                RightForearm float NULL,
	                LeftThigh float NULL,
	                RightThigh float NULL,
	                LeftCalf float NULL,
                    RightCalf float NULL,
                    OxygenUse nvarchar(100) NULL,
	                OxygenAmount float NULL)`
        },
        {
            name: TableNames.addendum,
            createScript: `
                CREATE TABLE IF NOT EXISTS ${TableNames.addendum} (
	                Id uniqueidentifier NOT NULL,
                    AdmissionId uniqueidentifier NOT NULL,
                    Description nvarchar(${SqlColumnLength.long}) NOT NULL,
                    CreatedDate date NOT NULL)`
        }
    ];

    abstract getLookupItemsByName(name: string): Promise<Array<string>>;

    abstract getAppointmentInfoById(appointmentId: string): Promise<any>;

    abstract getAppointments(): Promise<Array<any>>;

    abstract getById(tableName: string, id: string): Promise<any>;

    abstract getAll(tableName: string, convertSqlServerDateToJsDate: boolean): Promise<Array<any>>;

    abstract bulkInsert(tableName: string, items: Array<any>): Promise<boolean>;

    abstract create(tableName: string, item: any, companyRelatedEntity: boolean): Promise<any>;

    abstract update(tableName: string, id: string, item: any): Promise<any>;

    abstract createTable(createTableModel: any): Promise<any>

    protected getColumnNames(item: any): Array<string> {
        let columnNames = [];
        for (let columnName in item) {
            if (item.hasOwnProperty) {
                columnNames.push(columnName);
            }
        }
        return columnNames;
    }

    protected getInsertValuesStatement(columnNames: Array<string>): string {
        return "(" + columnNames.join(",") + ")";
    }

    protected getSqlInsertItemScript(columnNames: Array<string>,
        item: any, convertJsDateToSqlServerDate: boolean): string {
        let insertValuesScript = " (";
        for (let i = 0; i < columnNames.length; i++) {

            let columnName = columnNames[i];
            let columnValue = item[columnName];

            let isNumber = TypeHelper.isNumber(columnValue);
            let isBoolean = TypeHelper.isBoolean(columnValue);
            let isString = TypeHelper.isString(columnValue);

            if (isString) {
                //escape single quote - single quote is not valid for sql
                const isSingleQuoteExist = columnValue.indexOf("'") !== -1;
                if (isSingleQuoteExist)
                    columnValue = columnValue.replace(/'/g, "''");
            }

            if (convertJsDateToSqlServerDate) {
                if (TypeHelper.isDate(columnValue)) {
                    columnValue = DateConverter.jsLocalDateToSqlServerUtc(columnValue);
                }
            }

            let formattedColumnValue;

            if (isNumber) {
                formattedColumnValue = columnValue;
            }
            else if (isBoolean) {
                formattedColumnValue = columnValue ? 1 : 0;
            }
            else if (columnValue === null) {
                formattedColumnValue = null;
            }
            else {
                formattedColumnValue = "'" + columnValue + "'";
            }

            insertValuesScript += formattedColumnValue;

            if (i === columnNames.length - 1) {
                insertValuesScript += ")"
            }
            else {
                insertValuesScript += ", "
            }
        }
        return insertValuesScript;

    }

    generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}