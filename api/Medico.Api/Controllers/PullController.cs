using System.Linq;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.Controllers
{
    [Route("api/pull")]
    public class PullController : Controller
    {
        private readonly MedicoContext _medicoContext;

        public PullController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        #region template lookup item category

        [Route("templatelookupitemcategory")]
        public async Task<IActionResult> TemplateLookupItemCategory()
        {
            var categories = await _medicoContext.Set<TemplateLookupItemCategory>()
                .Select(t => new
                {   
                    t.Id,
                    t.IsActive,
                    t.Name,
                    t.Title
                })
                .ToListAsync();
            return Ok(categories);
        }

        #endregion

        #region template lookup item

        [Route("templatelookupitem")]
        public async Task<IActionResult> TemplateLookupItem()
        {
            var templateLookupItems = await _medicoContext.Set<TemplateLookupItem>()
                .Select(t => new
                {
                    t.Id,
                    t.CompanyId,
                    t.IsActive,
                    t.JsonValues,
                    t.Name,
                    t.TemplateLookupItemCategoryId,
                    t.Title
                })
                .ToListAsync();
            return Ok(templateLookupItems);
        }

        #endregion

        #region signature info

        [Route("signatureinfo")]
        public async Task<IActionResult> SignatureInfo()
        {
            var admissions = await _medicoContext.Set<SignatureInfo>()
                .Select(t => new
                {
                    t.Id,
                    t.EmployeeId,
                    t.AdmissionId,
                    t.IsUnsigned,
                    t.SignDate
                })
                .ToListAsync();
            return Ok(admissions);
        }

        #endregion

        #region admission

        [Route("admission")]
        public async Task<IActionResult> Admission()
        {
            var admissions = await _medicoContext.Set<Admission>()
                .Select(t => new
                {
                    t.Id,
                    t.PatientDemographicId,
                    t.IsDelete,
                    t.AppointmentId,
                    t.CreatedDate,
                    t.AdmissionData
                })
                .ToListAsync();
            return Ok(admissions);
        }

        #endregion

        #region appointment

        [Route("appointment")]
        public async Task<IActionResult> Appointment()
        {
            var appointments = await _medicoContext.Set<Appointment>()
                .Select(t => new
                {
                    t.Id,
                    t.PatientDemographicId,
                    t.IsDelete,
                    t.CompanyId,
                    t.LocationId,
                    t.PhysicianId,
                    t.NurseId,
                    t.RoomId,
                    t.StartDate,
                    t.EndDate,
                    t.AppointmentStatus,
                    t.AdmissionId,
                    t.Allegations
                })
                .ToListAsync();
            return Ok(appointments);
        }

        #endregion

        #region company

        [Route("company")]
        public async Task<IActionResult> Company()
        {
            var companies = await _medicoContext.Set<Company>()
                .Select(t => new
                {
                    t.Id,
                    t.IsDelete,
                    t.Name,
                    t.Address,
                    t.SecondaryAddress,
                    t.City,
                    t.State,
                    t.ZipCode,
                    t.Phone,
                    t.Fax,
                    t.WebSiteUrl
                })
                .ToListAsync();
            return Ok(companies);
        }

        #endregion

        #region cpt code

        [Route("cptcode")]
        public async Task<IActionResult> CptCode()
        {
            var cptCodes = await _medicoContext.Set<CptCode>()
                .Select(t => new
                {
                    t.Id,
                    t.IsDelete,
                    t.Name,
                    t.Code,
                    t.Description
                })
                .ToListAsync();
            return Ok(cptCodes);
        }

        #endregion

        #region employee

        [Route("employee")]
        public async Task<IActionResult> Employee()
        {
            var employees = await _medicoContext.Set<Employee>()
                .Select(t => new
                {
                    t.Id,
                    t.IsActive,
                    t.CompanyId,
                    t.FirstName,
                    t.MiddleName,
                    t.LastName,
                    t.Address,
                    t.SecondaryAddress,
                    t.City,
                    t.State,
                    t.Zip,
                    t.PrimaryPhone,
                    t.SecondaryPhone,
                    t.EmployeeType,
                    t.Ssn,
                    t.Gender,
                    t.DateOfBirth,
                    t.AppUserId,
                    t.NamePrefix,
                    t.NameSuffix
                })
                .ToListAsync();
            return Ok(employees);
        }

        #endregion

        #region location

        [Route("location")]
        public async Task<IActionResult> Location()
        {
            var locations = await _medicoContext.Set<Location>()
                .Select(t => new
                {
                    t.Id,
                    t.IsActive,
                    t.CompanyId,
                    t.Name,
                    t.Address,
                    t.SecondaryAddress,
                    t.City,
                    t.State,
                    t.Zip,
                    t.Fax,
                    t.Phone
                })
                .ToListAsync();
            return Ok(locations);
        }

        #endregion

        #region patient demographic

        [Route("patientdemographic")]
        public async Task<IActionResult> PatientDemographic()
        {
            var patientDemographics = await _medicoContext.Set<PatientDemographic>()
                .Select(t => new
                {
                    t.Id,
                    t.IsDelete,
                    t.CompanyId,
                    t.FirstName,
                    t.LastName,
                    t.Gender,
                    t.DateOfBirth,
                    t.MaritalStatus,
                    t.Ssn,
                    t.MiddleName,
                    t.PrimaryAddress,
                    t.SecondaryAddress,
                    t.PrimaryPhone,
                    t.SecondaryPhone,
                    t.City,
                    t.State,
                    t.PatientInsuranceId,
                    t.Email,
                    t.Zip
                })
                .ToListAsync();
            return Ok(patientDemographics);
        }

        #endregion

        #region patient insurance

        [Route("patientinsurance")]
        public async Task<IActionResult> PatientInsurance()
        {
            var patientInsurances = await _medicoContext.Set<PatientInsurance>()
                .Select(t => new
                {
                    t.Id,
                    t.IsDelete,
                    t.CaseNumber,
                    t.RqId,
                    t.FirstName,
                    t.LastName,
                    t.Gender,
                    t.DateOfBirth,
                    t.PatientDemographicId,
                    t.Ssn,
                    t.MiddleName,
                    t.PrimaryAddress,
                    t.SecondaryAddress,
                    t.PrimaryPhone,
                    t.SecondaryPhone,
                    t.City,
                    t.State,
                    t.Email,
                    t.Zip
                })
                .ToListAsync();
            return Ok(patientInsurances);
        }

        #endregion

        #region room

        [Route("room")]
        public async Task<IActionResult> Room()
        {
            var rooms = await _medicoContext.Set<Room>()
                .Select(t => new
                {
                    t.Id,
                    t.IsActive,
                    t.LocationId,
                    t.Name
                })
                .ToListAsync();
            return Ok(rooms);
        }

        #endregion

        #region patient data model

        [Route("patientdatamodel")]
        public async Task<IActionResult> PatientDataModel()
        {
            var patientDataModels = await _medicoContext.Set<PatientDataModel>()
                .Select(p => new
                {
                    p.Id,
                    p.IsDelete,
                    p.CompanyId,
                    p.JsonPatientDataModel
                })
                .ToListAsync();
            return Ok(patientDataModels);
        }

        #endregion

        #region chief complaint


        [Route("chiefcomplaint")]
        public async Task<IActionResult> ChiefComplaint()
        {
            var chiefComplaints = await _medicoContext.Set<ChiefComplaint>()
                .Select(c => new { c.CompanyId, c.Name, c.Title, c.Id, c.IsDelete })
                .ToListAsync();
            return Ok(chiefComplaints);
        }

        #endregion

        #region template

        [Route("template")]
        public async Task<IActionResult> Template()
        {
            var templates = await _medicoContext.Set<Template>()
                .Select(t => new
                {
                    t.Id,
                    t.CompanyId,
                    t.Value,
                    t.Name,
                    t.TemplateTypeId,
                    t.Title,
                    t.IsRequired,
                    t.IsActive,
                    t.DetailedTemplateHtml,
                    t.DefaultTemplateHtml,
                    t.TemplateOrder,
                    t.IsHistorical,
                    t.ReportTitle
                })
                .ToListAsync();
            return Ok(templates);
        }

        #endregion

        #region template type

        [Route("templatetype")]
        public async Task<IActionResult> TemplateType()
        {
            var templateTypes = await _medicoContext.Set<TemplateType>()
                .Select(t => new
                {
                    t.Id,
                    t.CompanyId,
                    t.Title,
                    t.Name,
                    t.IsActive
                })
                .ToListAsync();
            return Ok(templateTypes);
        }

        #endregion

        #region chief complaint template

        [Route("chiefcomplainttemplate")]
        public async Task<IActionResult> ChiefComplaintTemplate()
        {
            var chiefComplaintTemplates = await _medicoContext.Set<ChiefComplaintTemplate>()
                .Select(t => new
                {
                    t.ChiefComplaintId,
                    t.TemplateId,
                    t.IsDelete
                })
                .ToListAsync();
            return Ok(chiefComplaintTemplates);
        }

        #endregion

        #region icd code

        [Route("icdcode")]
        public async Task<IActionResult> IcdCode()
        {
            var icdCodes = await _medicoContext.Set<IcdCode>()
                .Select(c => new
                {
                    c.Notes,
                    c.Code,
                    c.Id,
                    c.Name
                })
                .ToListAsync();
            return Ok(icdCodes);
        }

        #endregion

        #region medical record history

        [Route("medicalrecord")]
        public async Task<IActionResult> MedicalRecord()
        {
            var medicalRecords = await _medicoContext
                .Set<MedicalRecord>()
                .Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.Diagnosis,
                    c.PatientId,
                    c.Notes,
                    c.CreatedDate
                })
                .ToListAsync();
            return Ok(medicalRecords);
        }

        #endregion

        #region medical history

        [Route("medicalhistory")]
        public async Task<IActionResult> MedicalHistory()
        {
            var medicalHistory = await _medicoContext.Set<MedicalHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.Diagnosis,
                    c.PatientId,
                    c.Notes,
                    c.CreatedDate
                })
                .ToListAsync();
            return Ok(medicalHistory);
        }

        #endregion

        #region surgical history

        [Route("surgicalhistory")]
        public async Task<IActionResult> SurgicalHistory()
        {
            var surgicalHistory = await _medicoContext.Set<SurgicalHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.Diagnosis,
                    c.PatientId,
                    c.Notes,
                    c.CreatedDate
                })
                .ToListAsync();
            return Ok(surgicalHistory);
        }

        #endregion

        #region family history


        [Route("familyhistory")]
        public async Task<IActionResult> FamilyHistory()
        {
            var surgicalHistory = await _medicoContext.Set<FamilyHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.Diagnosis,
                    c.Notes,
                    c.PatientId,
                    c.FamilyMember,
                    c.FamilyStatus,
                    c.CreatedDate
                })
                .ToListAsync();
            return Ok(surgicalHistory);
        }

        #endregion

        #region education history

        [Route("educationhistory")]
        public async Task<IActionResult> EducationHistory()
        {
            var educationHistory = await _medicoContext.Set<EducationHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.PatientId,
                    c.CreatedDate,
                    c.Degree,
                    c.YearCompleted,
                    c.Notes
                })
                .ToListAsync();
            return Ok(educationHistory);
        }

        #endregion

        #region occupational history

        [Route("occupationalhistory")]
        public async Task<IActionResult> OccupationalHistory()
        {
            var occupationalHistory = await _medicoContext.Set<OccupationalHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(c => new
                {
                    c.IsDelete,
                    c.Id,
                    c.Notes,
                    c.PatientId,
                    c.CreatedDate,
                    c.DisabilityClaimDetails,
                    c.EmploymentStatus,
                    c.End,
                    c.OccupationalType,
                    c.Start,
                    c.WorkersCompensationClaimDetails
                })
                .ToListAsync();
            return Ok(occupationalHistory);
        }

        #endregion

        #region allergy

        [Route("allergy")]
        public async Task<IActionResult> Allergy()
        {
            var allergies = await _medicoContext.Set<Allergy>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(a => new
                {
                    a.IsDelete,
                    a.Id,
                    a.PatientId,
                    a.CreatedDate,
                    a.Notes,
                    a.Medication,
                    a.Reaction
                })
                .ToListAsync();
            return Ok(allergies);
        }

        #endregion

        #region medication history

        [Route("medicationhistory")]
        public async Task<IActionResult> MedicationHistory()
        {
            var medicationHistory = await _medicoContext.Set<MedicationHistory>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(a => new
                {
                    a.IsDelete,
                    a.Id,
                    a.PatientId,
                    a.CreatedDate,
                    a.Medication,
                    a.Dose,
                    a.DoseSchedule,
                    a.MedicationStatus,
                    a.Prn,
                    a.Route,
                    a.Units,
                    a.Notes
                })
                .ToListAsync();
            return Ok(medicationHistory);
        }

        #endregion

        #region drug history

        [Route("drughistory")]
        public async Task<IActionResult> DrugHistory()
        {
            var alcoholHistory = await _medicoContext.Set<DrugHistory>()
                .Select(a => new
                {
                    a.IsDelete,
                    a.Id,
                    a.PatientId,
                    a.StatusLengthType,
                    a.Amount,
                    a.Duration,
                    a.Frequency,
                    a.Length,
                    a.Notes,
                    a.Quit,
                    a.Status,
                    a.StatusLength,
                    a.Use,
                    a.Type,
                    a.Route,
                    a.CreateDate
                })
                .ToListAsync();
            return Ok(alcoholHistory);
        }

        #endregion

        #region tobacco history

        [Route("tobaccohistory")]
        public async Task<IActionResult> TobaccoHistory()
        {
            var tobaccoHistory = await _medicoContext.Set<TobaccoHistory>()
                .Select(a => new
                {
                    a.IsDelete,
                    a.Id,
                    a.PatientId,
                    a.Amount,
                    a.Duration,
                    a.Frequency,
                    a.Length,
                    a.Notes,
                    a.Quit,
                    a.Status,
                    a.StatusLength,
                    a.Use,
                    a.Type,
                    a.CreateDate,
                    a.StatusLengthType
                })
                .ToListAsync();
            return Ok(tobaccoHistory);
        }

        #endregion

        #region alcohol history

        [Route("alcoholhistory")]
        public async Task<IActionResult> AlcoholHistory()
        {
            var alcoholHistory = await _medicoContext.Set<AlcoholHistory>()
                .Select(a => new
                {
                    a.IsDelete,
                    a.Id,
                    a.PatientId,
                    a.StatusLengthType,
                    a.Amount,
                    a.Duration,
                    a.Frequency,
                    a.Length,
                    a.Notes,
                    a.Quit,
                    a.Status,
                    a.StatusLength,
                    a.Use,
                    a.Type,
                    a.CreateDate
                })
                .ToListAsync();
            return Ok(alcoholHistory);
        }

        #endregion

        #region app user

        [Route("appuser")]
        public async Task<IActionResult> AppUser()
        {
            var appUsers = await _medicoContext.Set<AppUser>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(u => new
                {
                    u.IsDelete,
                    u.Id,
                    u.Hash,
                    u.IsSuperAdmin,
                    u.Login
                })
                .ToListAsync();
            return Ok(appUsers);
        }

        #endregion

        #region permission group

        [Route("permissiongroup")]
        public async Task<IActionResult> PermissionGroup()
        {
            var permissionGroups = await _medicoContext.Set<PermissionGroup>().Where(mh => mh.IsDelete == null || !mh.IsDelete.Value)
                .Select(g => new
                {
                    g.IsDelete,
                    g.Id,
                    g.Permissions,
                    g.Name
                })
                .ToListAsync();
            return Ok(permissionGroups);
        }

        #endregion

        #region app user permission group

        [Route("appuserpermissiongroup")]
        public async Task<IActionResult> AppUserPermissionGroup()
        {
            var userPermissionGroups = await _medicoContext.Set<AppUserPermissionGroup>()
                .Select(ug => new
                {
                    ug.AppUserId,
                    ug.PermissionGroupId
                })
                .ToListAsync();
            return Ok(userPermissionGroups);
        }

        #endregion

        #region extra field

        [Route("extrafield")]
        public async Task<IActionResult> ExtraField()
        {
            var extraFields = await _medicoContext.Set<ExtraField>()
                .Select(ef => new
                {
                    ef.IsActive,
                    ef.ShowInList,
                    ef.Id,
                    ef.Title,
                    ef.Name,
                    ef.RelatedEntityName,
                    ef.Type
                })
                .ToListAsync();
            return Ok(extraFields);
        }

        #endregion

        #region entity extrafield map

        [Route("entityextrafieldmap")]
        public async Task<IActionResult> EntityExtraFieldMap()
        {
            var entityExtraFieldMaps = await _medicoContext.Set<EntityExtraFieldMap>()
                .Select(e => new
                {
                    e.EntityId,
                    e.ExtraFieldId,
                    e.Value
                })
                .ToListAsync();
            return Ok(entityExtraFieldMaps);
        }

        #endregion

        #region chief complaint keyword

        [Route("chiefcomplaintkeyword")]
        public async Task<IActionResult> ChiefComplaintKeyword()
        {
            var chiefComplaintKeywords = await _medicoContext.Set<ChiefComplaintKeyword>()
                .Select(e => new
                {
                    e.Id,
                    e.IsDelete,
                    e.Value
                })
                .ToListAsync();
            return Ok(chiefComplaintKeywords);
        }

        #endregion

        #region chief complaint related keyword

        [Route("chiefcomplaintrelatedkeyword")]
        public async Task<IActionResult> ChiefComplaintRelatedKeyword()
        {
            var chiefComplaintRelatedKeywords = await _medicoContext.Set<ChiefComplaintRelatedKeyword>()
                .Select(e => new
                {
                    e.ChiefComplaintId,
                    e.KeywordId,
                    e.IsDelete
                })
                .ToListAsync();
            return Ok(chiefComplaintRelatedKeywords);
        }

        #endregion

        #region template lookup item tracker

        [Route("templatelookupitemtracker")]
        public async Task<IActionResult> TemplateLookupItemTracker()
        {
            var chiefComplaintRelatedKeywords = await _medicoContext.Set<TemplateLookupItemTracker>()
                .Select(e => new
                {
                    e.TemplateId,
                    e.TemplateLookupItemId,
                    e.NumberOfLookupItemsInTemplate
                })
                .ToListAsync();
            return Ok(chiefComplaintRelatedKeywords);
        }

        #endregion

        #region lookup item

        [Route("lookupitem")]
        public async Task<IActionResult> LookupItem()
        {
            var lookupItems = await _medicoContext.Set<LookupItem>()
                .Select(l => new
                {
                    l.Id,
                    l.IsDelete,
                    l.LookupItemCollectionId,
                    l.Value
                })
                .ToListAsync();
            return Ok(lookupItems);
        }

        #endregion

        #region lookup item collection

        [Route("lookupitemcollection")]
        public async Task<IActionResult> LookupItemCollection()
        {
            var lookupItemCollections = await _medicoContext.Set<LookupItemCollection>()
                .Select(l => new
                {
                    l.Id,
                    l.IsDelete,
                    l.Name
                })
                .ToListAsync();
            return Ok(lookupItemCollections);
        }

        #endregion

        #region vital signs

        [Route("vitalsigns")]
        public async Task<IActionResult> VitalSigns()
        {
            var vitalSigns = await _medicoContext.Set<VitalSigns>()
                .Select(vs => new
                {
                    vs.Id,
                    vs.AdmissionId,
                    vs.IsDelete,
                    vs.BloodPressureLocation,
                    vs.BloodPressurePosition,
                    vs.CreateDate,
                    vs.DiastolicBloodPressure,
                    vs.OxygenSaturationAtRest,
                    vs.RespirationRate,
                    vs.Pulse,
                    vs.PatientId,
                    vs.SystolicBloodPressure,
                    vs.OxygenSaturationAtRestValue
                })
                .ToListAsync();
            return Ok(vitalSigns);
        }

        #endregion

        #region base vital signs

        [Route("basevitalsigns")]
        public async Task<IActionResult> BaseVitalSigns()
        {
            var vitalSigns = await _medicoContext.Set<BaseVitalSigns>()
                .Select(vs => new
                {
                    vs.Id,
                    vs.IsDelete,
                    vs.PatientId,
                    vs.Weight,
                    vs.Height,
                    vs.DominantHand,
                    vs.RightCalf,
                    vs.RightBicep,
                    vs.RightForearm,
                    vs.RightThigh,
                    vs.LeftBicep,
                    vs.LeftThigh,
                    vs.LeftCalf,
                    vs.LeftForearm,
                    vs.OxygenUse,
                    vs.OxygenAmount
                })
                .ToListAsync();
            return Ok(vitalSigns);
        }

        #endregion

        #region addendum

        [Route("addendum")]
        public async Task<IActionResult> Addendum()
        {
            var addendums = await _medicoContext.Set<Addendum>()
                .Select(vs => new   
                {
                    vs.Id,
                    vs.AdmissionId,
                    vs.Description,
                    vs.CreatedDate
                })
                .ToListAsync();
            return Ok(addendums);
        }

        #endregion
    }
}
