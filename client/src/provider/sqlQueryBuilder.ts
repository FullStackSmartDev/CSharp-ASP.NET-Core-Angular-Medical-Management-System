import { Injectable } from '@angular/core';
import { StringHelper } from '../helpers/stringHelper';
import { TableNames } from '../constants/tableNames';
import { ApplicationConfigurationService } from './applicationConfigurationService';
import { SearchFilter } from '../classes/searchFilter';

@Injectable()
export class SqlQueryBuilder {
    getTemplatesGroupedByTypeQuery(): string {
        return `select tt.Title as TemplateType, count(t.Id) as TemplatesCount from Template as t
        join TemplateType as tt on tt.Id = t.TemplateTypeId
        group by tt.Title
        order by tt.Title asc`;
    }

    getTemplateLookupItemValuesByNameCategoryName(name: string, categoryName: string): any {
        return StringHelper.format("SELECT t.JsonValues FROM TemplateLookupItem AS t JOIN TemplateLookupItemCategory AS c ON c.Id = t.TemplateLookupItemCategoryId WHERE t.Name = '{0}' AND c.Name = '{1}'",
            name, categoryName);
    }

    getManyToManyUpdateSqlQuery(tableName: string, item: any) {
        const isDelete = (item.IsDelete ? 1 : 0).toString();
        let query = StringHelper.format("UPDATE {0} SET IsDelete = {1} WHERE ", tableName, isDelete);
        const itemsIncludedInWHEREQuery = [];
        for (var propertyName in item) {
            if (item.hasOwnProperty(propertyName) && propertyName !== "IsDelete") {
                itemsIncludedInWHEREQuery.push({
                    propertyName: propertyName,
                    propertyValue: item[propertyName]
                });
            }
        }
        for (let i = 0; i < itemsIncludedInWHEREQuery.length; i++) {
            const itemIncludedInWHEREQuery = itemsIncludedInWHEREQuery[i];
            const propertyName = itemIncludedInWHEREQuery.propertyName;
            const propertyValue = itemIncludedInWHEREQuery.propertyValue;
            query += StringHelper.format("{0} = '{1}'", propertyName, propertyValue);
            if (i !== itemsIncludedInWHEREQuery.length - 1) {
                query += " AND ";
            }
        }

        return query;
    }

    getPatientInsuranceByDemographicsIdQuery(demographicsId: any): any {
        return StringHelper.format("SELECT * FROM {0} WHERE PatientDemographicId ='{1}'",
            TableNames.patientInsurance, demographicsId);
    }

    deleteItemsBySpecificIdsQuery(tableName: string, itemIdsToDelete: any[]): any {
        const inQuery = this.getIncludeInQuery(true, "Id", itemIdsToDelete);
        return StringHelper.format("DELETE FROM {0}{1}", tableName, inQuery);
    }

    getRequiredTemplatesQuery(): any {
        return StringHelper.format("SELECT t.Id, t.TemplateOrder, t.Name AS TemplateName, t.ReportTitle as TemplateReportTitle, t.Title AS TemplateTitle, tt.Name AS TemplateTypeName FROM {0} AS t JOIN {1} AS tt ON t.TemplateTypeId = tt.Id WHERE t.IsRequired = 1 AND t.IsActive = 1",
            TableNames.template, TableNames.templateType);
    }

    getLookupItemsByNameQuery(name: string): string {
        return StringHelper.format("SELECT JsonValues FROM {0} WHERE NAME = '{1}' AND IsDelete = 0", TableNames.templateLookupItem, name);
    }

    getAppointmentGridViewSqlQuery() {
        return "select a.AppointmentStatus, physician.FirstName as PhysicianFirstName, physician.LastName as PhysicianLastName, nurse.FirstName as NurseFirstName, nurse.LastName as NurseLastName, r.Name as Room, l.Name as Location, a.Id as AppointmentId, a.StartDate, a.EndDate, pa.Gender as PatientGender, pa.DateOfBirth as PatientDateOfBirth, pa.FirstName as PatientFirstName, pa.LastName as PatientLastName  from Appointment as a join PatientDemographic as pa on a.PatientDemographicId = pa.Id join Location as l on a.LocationId = l.Id join Room as r on r.LocationId = l.Id join Employee as nurse on nurse.Id = a.NurseId join Employee as physician on physician.Id = a.PhysicianId;";
    }

    getAppointmentInfoSqlQuery(appointmentId: string): string {
        return StringHelper.format("select a.AdmissionId, a.Id as AppointmentId, p.Id as PatientDemographicId, p.FirstName as PatientFirstName, p.LastName as PatientLastName from Appointment as a join PatientDemographic as p on p.Id = a.PatientDemographicId where a.Id = '{0}';", appointmentId);
    }

    getByIdSqlQuery(tableName: string, id: string): string {
        return StringHelper.format("SELECT * FROM {0} WHERE Id = '{1}'", tableName, id);
    }

    getAllSqlQuery(tableName: string): string {
        return StringHelper.format("SELECT * FROM {0}", tableName);
    }

    deleteAllSqlQuery(tableName: string): string {
        return StringHelper.format("DELETE FROM {0}", tableName);
    }

    getCptCodeSearchQuery(searchText: string, limit: number): string {
        const limitStr = limit.toString();
        return StringHelper.format("SELECT * FROM {0} WHERE Name like '%{1}%' LIMIT {2}", TableNames.cptCode, searchText, limitStr);
    }

    getPatientAdmissionModelByCompanyIdQuery(companyId): string {
        const isCompanyIdSpecified = !!companyId;
        return isCompanyIdSpecified
            ? StringHelper.format("SELECT * FROM {0} WHERE CompanyId = {1}", TableNames.patientDataModel, companyId)
            : StringHelper.format("SELECT * FROM {0} WHERE CompanyId IS NULL", TableNames.patientDataModel);
    }

    getLastPatientAdmissionModelQuery(patientDemographicId: string): string {
        return StringHelper.format("SELECT a.PatientDemographicId, a.CreatedDate, a.AdmissionData from Admission AS a INNER JOIN (SELECT PatientDemographicId, max(CreatedDate) as MaxCreatedDate from Admission GROUP BY PatientDemographicId) ma ON ma.PatientDemographicId = a.PatientDemographicId AND a.CreatedDate = ma.MaxCreatedDate WHERE a.PatientDemographicId = '{0}'", patientDemographicId);
    }

    getChiefComplaintSearchQuery(searchText: string) {
        let query = StringHelper.format("SELECT cc.Id, cc.Title, cck.Value as KeywordValue FROM {0} AS cc JOIN {1} AS ccrk ON cc.Id = ccrk.ChiefComplaintId JOIN {2} AS cck ON cck.Id = ccrk.KeywordId WHERE cc.IsDelete = 0",
            TableNames.chiefComplaint, TableNames.chiefComplaintRelatedKeyword, TableNames.chiefComplaintKeyword);
        if (searchText) {
            query += StringHelper.format(" AND (Name LIKE '%{0}%' OR cck.Value LIKE '%{1}%')", searchText, searchText);
        }
        return query += this.defaultLimitQuery;
    }

    getAllegationsRelatedChiefComplaintsQuery(allegations: string[],
        alreadyAddedChiefComplaintIds: string[]): any {
        let query = StringHelper.format("SELECT cc.Id, cc.Title, cck.Value as KeywordValue FROM {0} AS cc JOIN {1} AS ccrk ON cc.Id = ccrk.ChiefComplaintId JOIN {2} AS cck ON cck.Id = ccrk.KeywordId WHERE cc.IsDelete = 0",
            TableNames.chiefComplaint, TableNames.chiefComplaintRelatedKeyword, TableNames.chiefComplaintKeyword);
        let filterQuery = " AND ("
        allegations.forEach((a, index) => {
            filterQuery += `Name LIKE '%${a}%' OR cck.Value LIKE '%${a}%'`;
            if (index !== allegations.length - 1) {
                filterQuery += " OR ";
            }
        })
        filterQuery += ")";
        query += filterQuery;
        if (alreadyAddedChiefComplaintIds.length) {
            query += this.getNotInQuery(false, "cc.Id", alreadyAddedChiefComplaintIds);
        }

        return query;
    }

    getTemplateLookupCategorySearchQuery(searchText: string) {
        const limitStr = ApplicationConfigurationService.defaultTakeItemsCount.toString();
        const baseQuery = StringHelper.format("SELECT * FROM {0} WHERE IsDelete = 0", TableNames.templateLookupItemCategory);
        return searchText
            ? StringHelper.format("{0} And Name like '%{1}%' LIMIT {2}", baseQuery, searchText, limitStr)
            : StringHelper.format("{0} LIMIT {1}", baseQuery, limitStr);
    }

    checkByNameSearchQuery(tableName: string, name: string): string {
        return StringHelper.format("SELECT * FROM {0} WHERE Name='{1}'", tableName, name);
    }

    getTempateLookupItemSearchQuery(name: string, categoryId: string): string {
        let query = StringHelper.format("SELECT * FROM {0}", TableNames.templateLookupItem);
        if (name) {
            query += StringHelper.format(" WHERE Name LIKE '%{0}%'", name);
        }
        if (categoryId) {
            query += StringHelper.format(" {0} TemplateLookupItemCategoryId='{1}'", name ? "AND" : "WHERE", categoryId);
        }

        return query += this.defaultLimitQuery;
    }

    getTempateLookupItemWithCategoryName(templateLookupItemId: string): string {
        return StringHelper.format("SELECT c.Name as CategoryName, t.Name FROM {0} AS t JOIN TemplateLookupItemCategory as c ON t.TemplateLookupItemCategoryId = c.Id WHERE t.Id = '{1}'",
            TableNames.templateLookupItem, templateLookupItemId);
    }

    getTempateSearchQuery(name: string): string {
        return StringHelper.format("SELECT * FROM {0} WHERE Name like '%{1}%' LIMIT {2}", TableNames.template, name, ApplicationConfigurationService.defaultTakeItemsCount.toString());
    }

    getTemplateTypeSearchQuery(name: string): string {
        let query = StringHelper.format("SELECT * FROM {0} WHERE IsDelete = 0", TableNames.templateType);
        if (name) {
            query += StringHelper.format(" and Name like '%{0}%'", name);
        }

        return query += this.defaultLimitQuery;
    }

    getByNameSearchQuery(tableName: string, name: string): string {
        return StringHelper.format("SELECT * FROM {0} WHERE Name = '{1}'",
            tableName, name);
    }

    getChiefComplaintTemplatesSearchQuery(chiefComplaintId: string): string {
        return StringHelper.format("SELECT t.Id AS TemplateId, t.ReportTitle, t.Name, t.TemplateOrder, tp.Id as TemplateTypeId, t.Title, tp.Name AS Type from {0} AS ct JOIN {1} AS t ON t.Id = ct.TemplateId JOIN {2} as tp ON tp.Id = t.TemplateTypeId WHERE ct.ChiefComplaintId = '{3}' AND ct.IsDelete = 0",
            TableNames.chiefComplaintTemplate, TableNames.template, TableNames.templateType, chiefComplaintId);
    }

    getTemplatesByTypeSearchQuery(searchString: string, templateType: string, excludedTemplateIds: Array<string>): string {
        const addNotInStatement = excludedTemplateIds &&
            excludedTemplateIds.length && excludedTemplateIds.length > 0;
        let query = StringHelper.format("SELECT t.Id, t.TemplateOrder, t.ReportTitle, t.Name, t.Title FROM {0} AS t JOIN {1} AS tt on tt.Id = t.TemplateTypeId WHERE tt.Name = '{2}' AND t.IsActive = 1",
            TableNames.template, TableNames.templateType, templateType);
        if (searchString) {
            query += StringHelper.format(" AND t.ReportTitle like '%{0}%'", searchString);
        }
        if (addNotInStatement) {
            query += this.getNotInQuery(false, "t.Id", excludedTemplateIds);
        }

        return query;
    }

    getChiefComplaintsTemplatesQuery(chiefComplaintIds: Array<string>): any {
        let query = StringHelper.format("SELECT t.Id, t.Title, t.ReportTitle, tt.Name as TemplateType, cct.ChiefComplaintId FROM {0} as cct JOIN {1} as t ON t.Id = cct.TemplateId JOIN {2} as tt ON t.TemplateTypeId = tt.Id",
            TableNames.chiefComplaintTemplate, TableNames.template, TableNames.templateType);
        //query += this.getNonDeletedItemsQuery(true, "t");
        query += this.getActiveItemsQuery(true, "t");
        query += this.getNonDeletedItemsQuery(false, "cct");
        return query += this.getIncludeInQuery(false, 'cct.ChiefComplaintId', chiefComplaintIds);
    }

    getChiefComplaintsKeywordsQuery(chiefComplaintIds: string[]): any {
        let query = StringHelper.format("SELECT cck.Id, cck.Value, ccrk.ChiefComplaintId FROM {0} AS ccrk JOIN {1} AS cck ON cck.Id = ccrk.KeywordId",
            TableNames.chiefComplaintRelatedKeyword, TableNames.chiefComplaintKeyword);
        query += this.getNonDeletedItemsQuery(true, "cck");
        query += this.getNonDeletedItemsQuery(false, "ccrk");
        return query += this.getIncludeInQuery(false, 'ccrk.ChiefComplaintId', chiefComplaintIds);
    }

    getChiefComplaintsQuery(searchFilter: SearchFilter, includeCountQuery: boolean): any {
        let countQuery: string = "";
        let query = StringHelper.format("SELECT Id, Title, Name, IsDelete FROM {0}", TableNames.chiefComplaint);

        const includeDeletedItems = searchFilter.includeDeletedItems;
        const searchValue = searchFilter.searchValue;
        const usePagination = searchFilter.usePagination;

        if (!includeDeletedItems) {
            query += this.getNonDeletedItemsQuery(true);
        }

        if (searchValue) {
            query += StringHelper.format(" AND Title like '%{0}%'", searchValue);
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "Id");
        }

        query += this.getOrderByQuery("Title", true);

        if (usePagination) {
            query += this.getSkipTakeQuery(searchFilter.skip, searchFilter.take);
        }

        return {
            fullQuery: query,
            countQuery: countQuery
        };
    }

    getChiefComplaintTemplateById(templateId: string): string {
        return StringHelper.format("select t.Id as TemplateId, t.Name, t.ReportTitle, t.Title, tp.Name as Type from {0} as t join TemplateType as tp on tp.Id = t.TemplateTypeId where t.Id  = '{1}'", TableNames.template, templateId);
    }

    deleteChiefComplaintTemplatesQuery(chiefComplaintId: string): string {
        return StringHelper.format("DELETE FROM {0} WHERE ChiefComplaintId = '{1}'", TableNames.chiefComplaintTemplate, chiefComplaintId);
    }

    deleteChiefComplaintKeywordsQuery(chiefComplaintId: string): any {
        return StringHelper.format("DELETE FROM {0} WHERE ChiefComplaintId = '{1}'", TableNames.chiefComplaintRelatedKeyword, chiefComplaintId);
    }

    deleteUserPermissionGroupQuery(appUserId: any): string {
        return StringHelper.format("delete from {0} where AppUserId = '{1}'", TableNames.appUserPermissionGroup, appUserId);
    }

    createChiefComplaintTemplatesQuery(chiefComplaintId: string, templateIds: Array<string>): string {
        let insertStatement = StringHelper.format("INSERT INTO {0} (ChiefComplaintId, TemplateId) VALUES ", TableNames.chiefComplaintTemplate);
        for (let i = 0; i < templateIds.length; i++) {
            insertStatement += StringHelper.format("('{0}', '{1}')", chiefComplaintId, templateIds[i]);
            if (i !== templateIds.length - 1)
                insertStatement += ",";
            else
                insertStatement += ";";
        }

        return insertStatement;
    }

    getChiefComplaintByIds(ids: Array<string>): any {
        let includedIds = "";
        if (ids && ids.length && ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                includedIds += StringHelper.format("'{0}'", ids[i]);
                if (i !== ids.length - 1) {
                    includedIds += ","
                }
            }
        }
        return includedIds
            ? StringHelper.format("SELECT * FROM {0}", TableNames.chiefComplaint)
            : StringHelper.format("SELECT * FROM {0} WHERE Id in ({1})", TableNames.chiefComplaint, includedIds);
    }

    getTemplatesByTypeQuery(searchString: string, templateType: string): any {
        return StringHelper.format("select t.Id, t.IsDelete, t.CompanyId, t.Name, t.Title, t.Value, tt.Name as Type from {0} as t join {1} as tt on tt.Id = t.TemplateTypeId where tt.Name = '{2}' and t.Name like '%{3}%'",
            TableNames.template, TableNames.templateType, templateType, searchString)
    }

    getTemplatesByTypesQuery(types: Array<string>): any {
        let includedTypesQueryStatement = "";
        for (let i = 0; i < types.length; i++) {
            includedTypesQueryStatement += StringHelper.format("'{0}'", types[i]);
            if (i !== types.length - 1)
                includedTypesQueryStatement += ", "
        }
        return StringHelper.format("select t.Id, t.IsDelete, t.CompanyId, t.Name, t.Title, t.Value, tt.Name as Type from {0} as t join {1} as tt on tt.Id = t.TemplateTypeId where tt.Name in ({2})",
            TableNames.template, TableNames.templateType, includedTypesQueryStatement)
    }

    getTemplateByNameAndTypeQuery(templateName: string, tempateType: string): any {
        return StringHelper.format("select t.Id, t.DefaultTemplateHtml, t.DetailedTemplateHtml, t.IsDelete, t.CompanyId, t.Name, t.Title, t.Value, t.IsRequired, t.TemplateTypeId, tt.Name as Type from {0} as t join {1} as tt on tt.Id = t.TemplateTypeId where t.Name = '{2}' and tt.Name = '{3}'",
            TableNames.template, TableNames.templateType, templateName, tempateType)
    }

    getMedicalHistorySearchQuery(tableName: string, patientId: string, skip: number, take: number, searchStr?: string): any {
        const isMedicalHistory = tableName === TableNames.medicalHistory;
        const limitQuery = StringHelper.format(" LIMIT {0}, {1}", skip.toString(), take.toString());
        const orderByQuery = " order by CreatedDate desc";
        const baseMedicalSearchQuery = isMedicalHistory
            ? StringHelper.format("select mh.Id, mh.Notes, mh.CreatedDate, ic.Name as IcdCodeName from {0} as mh join IcdCode as ic on ic.Id = mh.IcdCodeId where mh.PatientId = '{1}' and mh.IsDelete = 0", tableName, patientId)
            : StringHelper.format("select mh.Id, mh.Notes, mh.CreatedDate, cc.Description as CptCodeDescription from {0} as mh join CptCode as cc on cc.Id = mh.CptCodeId where mh.PatientId = '{1}' and mh.IsDelete = 0", tableName, patientId);

        return searchStr ? baseMedicalSearchQuery + StringHelper.format(" AND (mh.Notes like '%{0}%' {1} '%{2}%')", searchStr, isMedicalHistory ? "or ic.Name like" : "or cc.Description like", searchStr) + orderByQuery + limitQuery
            : baseMedicalSearchQuery + orderByQuery + limitQuery;
    }

    getMedicalHistoryTotalCountQuery(tableName: string, patientId: string): string {
        return StringHelper.format(" select count(Id) as MidicalHistoryCount from {0} where PatientId = '{1}'", tableName, patientId);
    }

    getFamilyHistorySearchQuery(patientId: string, skip: number, take: number, searchStr?: string): string {
        const limitQuery = StringHelper.format(" LIMIT {0}, {1}", skip.toString(), take.toString());
        const orderByQuery = " order by CreatedDate desc";
        const baseFamilySearchQuery = StringHelper.format("select fh.Id, fh.FamilyMember, fh.FamilyStatus, ic.Name as IcdCodeName, fh.CreatedDate FROM FamilyHistory as fh join IcdCode as ic on ic.Id = fh.IcdCodeId where fh.PatientId = '{0}' AND fh.IsDelete = 0", patientId);

        return searchStr ? baseFamilySearchQuery + StringHelper.format(" AND (fh.Notes like '%{0}%' OR ic.Name like '%{1}%')", searchStr, searchStr) + orderByQuery + limitQuery
            : baseFamilySearchQuery + orderByQuery + limitQuery;
    }

    getEducationHistorySearchQuery(patientId: string, skip: number, take: number, searchStr?: string): string {
        const limitQuery = StringHelper.format(" LIMIT {0}, {1}", skip.toString(), take.toString());
        const orderByQuery = " order by CreatedDate desc";
        const baseEducationSearchQuery = StringHelper.format("select Id, CreatedDate, Degree, YearCompleted, Notes from EducationHistory where PatientId = '{0}' AND IsDelete = 0", patientId);

        return searchStr ? baseEducationSearchQuery + StringHelper.format(" AND Notes like '%{0}%'", searchStr) + orderByQuery + limitQuery
            : baseEducationSearchQuery + orderByQuery + limitQuery;
    }

    getOccupationalSearchQuery(patientId: string, skip: number, take: number, searchStr?: string): any {
        const limitQuery = this.getSkipTakeQuery(skip, take);
        const orderByQuery = this.getOrderByQuery("CreatedDate", false);
        const baseOccupationalSearchQuery = StringHelper.format("select Id, CreatedDate, PatientId, OccupationalType, Start, End, DisabilityClaimDetails, WorkersCompensationClaimDetails, EmploymentStatus from OccupationalHistory where PatientId = '{0}' AND IsDelete = 0", patientId);
        return searchStr ? baseOccupationalSearchQuery + StringHelper.format(" AND (DisabilityClaimDetails like '%{0}%' OR WorkersCompensationClaimDetails like '%{1}%'", searchStr, searchStr) + orderByQuery + limitQuery
            : baseOccupationalSearchQuery + orderByQuery + limitQuery;
    }

    getPatientAllergiesSearchQuery(patientId: string, skip: number, take: number, searchStr?: string): any {
        const limitQuery = this.getSkipTakeQuery(skip, take);
        const orderByQuery = this.getOrderByQuery("CreatedDate", false);
        const baseAllergiesSearchQuery = StringHelper.format("select a.Id, m.Name as MedicationName, a.Reaction, a.Notes, a.CreatedDate from Allergy as a join Medication as m on m.Id = a.MedicationId where a.PatientId = '{0}'", patientId);
        return searchStr ? baseAllergiesSearchQuery + StringHelper.format(" AND (a.Notes like '%{0}%' OR m.Name like '%{1}%'", searchStr, searchStr) + orderByQuery + limitQuery
            : baseAllergiesSearchQuery + orderByQuery + limitQuery;
    }

    getHistoryTotalCountQuery(tableName: string, patientId: string): string {
        return StringHelper.format("select count(Id) as HistoryCount from {0} where PatientId = '{1}'", tableName, patientId);
    }

    getMedicationsSearchQuery(searchStr: string): string {
        const groupByQuery = this.getGroupByQuery("Name");
        const baseMedicationsSearchQuery = "select min(Id) as Id, Name from Medication";
        return baseMedicationsSearchQuery + StringHelper.format(" WHERE Name like '%{0}%'", searchStr) + groupByQuery;
    }

    getMedicationHistorySearchQuery(patientId: string, skip: number, take: number, searchStr?: string) {
        const limitQuery = this.getSkipTakeQuery(skip, take);
        const orderByQuery = this.getOrderByQuery("CreatedDate", false);
        const baseMedicationHistoryQuery = StringHelper.format("select m.Name as MedicationName, mh.Dose, mh.Units, mh.CreatedDate, mh.Route, mh.DoseSchedule, mh.Prn, mh.MedicationStatus from MedicationHistory as mh join Medication as m on m.Id = mh.MedicationId where mh.PatientId = '{0}'", patientId);
        return searchStr ? baseMedicationHistoryQuery + StringHelper.format(" AND m.Name like '%{0}%'", searchStr) + orderByQuery + limitQuery
            : baseMedicationHistoryQuery + orderByQuery + limitQuery;
    }

    getMedicationUnitsSearchQuery(searchStr: string): string {
        return StringHelper.format("select Units from Medication where Units like '%{0}%' group by Units", searchStr);
    }

    getLocationLookupSearchQuery(searchString: string): string {
        const baseQuery = StringHelper.format("select Name, Id from Location {0}", this.getNonDeletedItemsQuery(true));
        return searchString ? StringHelper.format("{0} and where Name like '%{1}%'", baseQuery, searchString) : baseQuery
    }

    getFilteredPatientsCountQuery(adjustedPatientFilter: any) {
        let query = "select count(p.Id) as ItemsCount from PatientDemographic as p";
        return this.applyPatientFilter(query, adjustedPatientFilter);
    }

    getFilteredPatientsQuery(skip: any, take: any, adjustedPatientFilter: any): any {
        let query = "select p.Id as PatientId, p.FirstName, p.MiddleName, p.LastName, p.DateOfBirth, p.MaritalStatus, p.Ssn, p.Gender, p.City, p.Email, p.PatientInsuranceId, p.PrimaryAddress, p.SecondaryAddress, p.PrimaryPhone, p.SecondaryPhone, p.State from PatientDemographic as p";
        return this.applyPatientFilter(query, adjustedPatientFilter);
    }

    private applyPatientFilter(baseQuery: string, adjustedPatientFilter: any): any {
        const appointmentStartDate = adjustedPatientFilter.appointmentStartDate;
        const appointmentEndDate = adjustedPatientFilter.appointmentEndDate;
        const patientName = adjustedPatientFilter.name;
        const patientDateOfBirth = adjustedPatientFilter.dateOfBirth;
        const patientSsn = adjustedPatientFilter.ssn;
        const physicianId = adjustedPatientFilter.physicianId;

        const joinAppointmentTable = !!(appointmentStartDate || appointmentEndDate || physicianId);
        const joinPhysicianTable = !!physicianId;

        if (joinAppointmentTable) {
            baseQuery += " join Appointment as a on a.PatientDemographicId = p.Id";
        }

        if (joinPhysicianTable) {
            baseQuery += " join Employee as e on e.Id = a.PhysicianId";
        }

        baseQuery += " where p.IsDelete = 0";

        if (appointmentStartDate) {
            baseQuery += StringHelper.format(" and a.StartDate >= '{0}'", appointmentStartDate);
        }

        if (appointmentEndDate) {
            baseQuery += StringHelper.format(" and a.EndDate <= '{0}'", appointmentEndDate);
        }

        if (physicianId) {
            baseQuery += StringHelper.format(" and e.ExmployeeType = 1 and e.Id = '{0}'", physicianId);
        }

        if (patientName) {
            baseQuery += StringHelper.format(" and (p.FirstName like '%{0}%' or p.LastName like '%{1}%')", patientName, patientName);
        }

        if (patientDateOfBirth) {
            baseQuery += StringHelper.format(" and p.DateOfBirth = '{0}'", patientDateOfBirth);
        }

        if (patientSsn) {
            baseQuery += StringHelper.format(" and p.Ssn like '%{0}%'", patientSsn);
        }

        return baseQuery;
    }

    getPatientsSearchQuery(searchString: string): string {
        const baseQuery = "select Id, FirstName, LastName from PatientDemographic";
        return searchString ? StringHelper.format("{0} where (FirstName like '%{1}%' or LastName like '%{1}%')", baseQuery, searchString, searchString) : baseQuery;
    }

    getEmploymentsSearchQuery(searchString: string, employmentType: number): any {
        return searchString
            ? StringHelper.format("select Id, FirstName, LastName from Employee where ExmployeeType = {0} AND (FirstName like '%{1}%' or LastName like '%{2}%') AND IsDelete = 0", employmentType.toString(), searchString, searchString)
            : StringHelper.format("select Id, FirstName, LastName from Employee where ExmployeeType = {0} AND IsDelete = 0", employmentType.toString())
    }

    getRoomsSearchQuery(searchString: string, locationId: string): any {
        let query = StringHelper.format("SELECT Id, Name FROM {0}", TableNames.room);
        if (searchString) {
            query += StringHelper.format(" WHERE Name like '%{0}%'", searchString);
        }
        if (locationId) {
            query += StringHelper.format(" {0} LocationId = '{1}'", searchString ? "AND" : "WHERE", locationId);
        }
        return query += this.defaultLimitQuery;
    }

    getAppointmentsSearchQuery(startDate: string, endDate: string, patientIds: Array<string>) {
        const orderBySqlStatement = " order by a.StartDate asc";
        let baseQuery = StringHelper.format("select a.Id, a.StartDate, a.EndDate, a.AppointmentStatus, l.Name as LocationName, l.Id as LocationId, r.Id as RoomId, r.Name as RoomName, p.Id as PatientId, p.FirstName as PatientFirstName, p.LastName as PatientLastName, p.DateOfBirth as PatientDateOfBirth, ph.Id as PhysicianId, ph.FirstName as PhysicianFirstName, ph.LastName as PhysicianLastName, n.Id as NurseId, n.FirstName as NurseFirstName, n.LastName as NurseLastName from Appointment as a join Location as l on l.Id = a.LocationId join PatientDemographic as p on p.Id = a.PatientDemographicId join Employee as ph on ph.Id = a.PhysicianId join Employee as n on n.Id = a.NurseId join Room as r on r.Id = a.RoomId where a.StartDate >= '{0}' and a.EndDate <= '{1}'", startDate, endDate);
        if (!patientIds || patientIds.length === 0) {
            return baseQuery + orderBySqlStatement;
        }

        let inSqlStatement = " and p.Id in ("
        for (let i = 0; i < patientIds.length; i++) {
            inSqlStatement += StringHelper.format("'{0}'", patientIds[i]);
            if (i !== patientIds.length - 1) {
                inSqlStatement += ", "
            }
        }
        inSqlStatement += ")"
        return baseQuery + inSqlStatement + orderBySqlStatement;
    }

    getAppointmentCountQuery(startDate: string, endDate: string): string {
        return StringHelper.format(" select count(Id) as AppointmentCount from Appointment where StartDate >= '{0}' AND EndDate <= '{1}'", startDate, endDate);
    }

    getAppointmentsPatientsByDateSearchQuery(startDate: any, endDate: any, searchValue: string): any {
        const baseQuery = StringHelper.format("select distinct p.Id as PatientId, p.FirstName as PatientFirstName, p.LastName as PatientLastName from Appointment as a join PatientDemographic as p on p.Id = a.PatientDemographicId where StartDate >= '{0}' AND EndDate <= '{1}'", startDate, endDate);
        if (!searchValue) {
            return baseQuery;
        }

        const likeSqlStatement = StringHelper.format(" and (p.FirstName like '%{0}%' or p.LastName like '%{1}%')", searchValue, searchValue);
        return baseQuery + likeSqlStatement;
    }

    getDeleteQuery(tableName: string, id: string) {
        return StringHelper.format("UPDATE {0} SET IsDelete = 1 WHERE Id = '{1}'", tableName, id);
    }

    vgenerateCountQuery(query: string, columnName: string): string {
        const countQuery = StringHelper.format("SELECT COUNT({0}) AS ItemsCount FROM", columnName);
        return query.replace(/(select|SELECT)(.*)(FROM|from)/, countQuery);
    }

    getEntitiesCountQuery(tableName: string, columnName: string): string {
        return StringHelper
            .format("SELECT COUNT({0}) AS ItemsCount FROM {1}", columnName, tableName);
    }

    getLocationsSearchQuery(skip: any, take: any,
        searchValue: any, includeDeletedItems: boolean, includeCountQuery: boolean): any {
        let countQuery: string = "";
        let query = StringHelper.format("select * from {0}", TableNames.location);

        if (!includeDeletedItems) {
            query += " where IsDelete = 0"
        }

        if (searchValue) {
            query += StringHelper.format(" {0} Name like '%{1}%'", includeDeletedItems ? "WHERE" : "AND", searchValue);
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "Id");
        }

        return {
            fullQuery: query += this.getSkipTakeQuery(skip, take),
            countQuery: countQuery
        };
    }

    getExtraFieldsSearchQuery(skip: any, take: any,
        searchValue: any, includeDeletedItems: boolean, includeCountQuery: true): any {
        let countQuery: string = "";
        let query = StringHelper.format("select * from {0}", TableNames.extraField);

        if (!includeDeletedItems) {
            query += " where IsDelete = 0";
        }

        if (searchValue) {
            query += StringHelper.format(" {0} Name like '%{1}%'", includeDeletedItems ? "WHERE" : "AND", searchValue);
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "Id");
        }

        return {
            fullQuery: query += this.getSkipTakeQuery(skip, take),
            countQuery: countQuery
        };
    }

    getLookupItemsSearchQuery(skip: any, take: any,
        searchValue: any, includeDeletedItems: boolean, includeCountQuery: boolean): any {
        let countQuery: string = "";
        let query = StringHelper.format("SELECT t.Id, t.Name, t.JsonValues, t.TemplateLookupItemCategoryId AS CategoryId, c.Title AS CategoryName, t.Title, t.IsDelete, t.CompanyId FROM {0} AS t join {1} AS c ON c.Id = t.TemplateLookupItemCategoryId",
            TableNames.templateLookupItem, TableNames.templateLookupItemCategory);

        if (!includeDeletedItems) {
            query += this.getNonDeletedItemsQuery(true, "t");
        }
        if (searchValue) {
            query += StringHelper.format(" {0} t.Name like '%{1}%'", includeDeletedItems ? "WHERE" : "AND", searchValue);
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "t.Id");
        }

        query += this.getOrderByQuery("t.Title", true);

        return {
            fullQuery: query += this.getSkipTakeQuery(skip, take),
            countQuery: countQuery
        };
    }

    getExtraFieldsByEntityNameSearchQuery(relatedEntityName: string): any {
        return StringHelper.format("select * from ExtraField where RelatedEntityName = '{0}' and IsDelete = 0", relatedEntityName);
    }

    getTemplateItemCategoriesSearchQuery(skip: any, take: any, searchValue: any, includeDeletedItems: boolean, includeCountQuery: boolean): any {
        let query = StringHelper.format("select * from {0}", TableNames.templateLookupItemCategory);
        let countQuery: string = "";

        if (!includeDeletedItems) {
            query += " where IsDelete = 0"
        }
        if (searchValue) {
            query += StringHelper.format(" {0} Name like '%{1}%'", includeDeletedItems ? "where" : "and", searchValue)
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "Id");
        }

        query += " order by Name asc";

        return {
            fullQuery: query += this.getSkipTakeQuery(skip, take),
            countQuery: countQuery
        };
    }

    getEmployeesSearchQuery(searchValue: any, includeDeletedItems: boolean,
        includeCountQuery: boolean): any {
        let countQuery: string = "";

        let query = "select e.Id, e.IsDelete, e.Ssn, e.DateOfBirth, e.Gender, e.FirstName, e.LastName, e.MiddleName, e.Address, e.SecondaryAddress, e.City, e.State, e.Zip, e.PrimaryPhone, e.SecondaryPhone, e.ExmployeeType, u.Login, g.Name as PermissionGroupName from Employee as e join AppUser as u on u.Id = e.AppUserId join AppUserPermissionGroup as pg on pg.AppUserId = u.Id join PermissionGroup as g on g.Id = pg.PermissionGroupId";

        if (searchValue) {
            query += StringHelper.format(" where (e.FirstName LIKE '%{0}%' OR e.LastName LIKE '%{1}%')", searchValue, searchValue);
        }

        if (!includeDeletedItems) {
            query += StringHelper.format(" {0} e.IsDelete = 0", searchValue ? "AND" : "WHERE");
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(query, "e.Id")
        }

        return {
            fullQuery: query,
            countQuery: countQuery
        };
    }

    getRoomListSearchQuery(skip: any, take: any, searchValue: any,
        includeDeletedItems: boolean, includeCountQuery: boolean): any {
        const limitQuery = this.getSkipTakeQuery(skip, take);
        let countQuery: string = "";

        let baseSearchQuery = StringHelper.format("select r.Id, r.Name, r.IsDelete, l.Name as Location from Room as r join Location as l on r.LocationId = l.Id where l.IsDelete = 0");
        if (searchValue) {
            baseSearchQuery += StringHelper.format(" and r.Name like '%{0}%'", searchValue);
        }

        if (!includeDeletedItems) {
            baseSearchQuery += " and r.IsDelete = 0"
        }

        if (includeCountQuery) {
            countQuery = this.generateCountQuery(baseSearchQuery, "r.Id");
        }

        return {
            fullQuery: baseSearchQuery += limitQuery,
            countQuery: countQuery
        };
    }

    getUserSelectQuery(login: string, encryptedPassword: string): string {
        return StringHelper.format("select * from {0} where Login = '{1}' and Hash = '{2}'", TableNames.appUser, login, encryptedPassword);
    }

    getPermissionSearchQuery(searchString: string): string {
        const basePermissionGroupQuery = StringHelper.format("select * from {0}", TableNames.permissionGroup);
        return searchString ? basePermissionGroupQuery + StringHelper.format(" where Name like '%{0}%'", searchString) : basePermissionGroupQuery;
    }

    getUserPermissionSearchQuery(userId: string): any {
        return StringHelper.format("select g.Id, g.Name as PermissionGroupName, g.Permissions as GroupPermissions from AppUser as u join AppUserPermissionGroup as ug on ug.AppUserId = u.Id join PermissionGroup as g on g.Id = ug.PermissionGroupId where u.Id = '{0}'", userId);
    }

    getFilters(loadOptions: any): any {
        if (loadOptions.filter) {
            return loadOptions.filter;
        }

        const searchExpr = loadOptions.searchExpr;
        const searchValue = loadOptions.searchValue;

        return !searchExpr || !searchValue
            ? null
            : [searchExpr, loadOptions.searchOperation, searchValue];
    }

    private getSkipTakeQuery(skip: number, take: number): string {
        return StringHelper.format(" LIMIT {0}, {1}", skip.toString(), take.toString());
    }

    private get defaultLimitQuery(): string {
        return StringHelper.format(" LIMIT {0}", ApplicationConfigurationService.defaultTakeItemsCount.toString());
    }

    private getOrderByQuery(columnName: string, isAscendingOrder: boolean): string {
        return StringHelper.format(" ORDER BY {0} {1}", columnName, isAscendingOrder ? "ASC" : "DESC");
    }

    private getGroupByQuery(columnName: string) {
        return StringHelper.format(" GROUP BY {0}", columnName);
    }

    private getNonDeletedItemsQuery(isFirstStatementInQuery: boolean,
        tableNameInQuery: string = ""): string {
        const deleteColumnName = tableNameInQuery ? StringHelper.format("{0}.IsDelete", tableNameInQuery) : "IsDelete";
        return StringHelper.format(" {0} {1} = 0", isFirstStatementInQuery ? "WHERE" : "AND", deleteColumnName);
    }

    private getActiveItemsQuery(isFirstStatementInQuery: boolean,
        tableNameInQuery: string = ""): string {
        const deleteColumnName = tableNameInQuery ? StringHelper.format("{0}.IsActive", tableNameInQuery) : "IsActive";
        return StringHelper.format(" {0} {1} = 1", isFirstStatementInQuery ? "WHERE" : "AND", deleteColumnName);
    }

    private getIncludeInQuery(isFirstStatementInQuery: boolean,
        columnName: string, items: Array<string>): string {
        const includedItems = this.joinStringsAccordingSql(items);
        return StringHelper
            .format(" {0} {1} IN ({2})", isFirstStatementInQuery ? "WHERE" : "AND", columnName, includedItems);
    }

    private getNotInQuery(isFirstStatementInQuery: boolean,
        columnName: string, items: Array<string>): string {
        const includedItems = this.joinStringsAccordingSql(items);
        return StringHelper
            .format(" {0} {1} NOT IN ({2})", isFirstStatementInQuery ? "WHERE" : "AND", columnName, includedItems);
    }

    private joinStringsAccordingSql(items: Array<string>) {
        let includedItems = "";
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            includedItems += StringHelper.format("'{0}'", item);
            if (i !== items.length - 1) {
                includedItems += ", "
            }
        }

        return includedItems;
    }

    private generateCountQuery(query: string, columnName: string): string {
        const countQuery = StringHelper.format("SELECT COUNT({0}) AS ItemsCount FROM", columnName);
        return query.replace(/(SELECT|select)(.*)(from|FROM)/, countQuery);
    }
}

class SqlQuery {
    fullQuery: string;
    countQuery: string;
}