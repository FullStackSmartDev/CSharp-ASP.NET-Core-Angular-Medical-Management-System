using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Medico.Api.Controllers
{
    [Route("api/push")]
    public class PushController : Controller
    {
        private readonly MedicoContext _medicoContext;

        public PushController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        #region patient demographic

        [HttpPost]
        [Route("patientdemographic")]
        public async Task<IActionResult> PatientDemographic([FromBody]IEnumerable<PatientDemographic> clientPatientDemographics)
        {
            var patientDemographics = await _medicoContext.Set<PatientDemographic>().ToListAsync();

            foreach (PatientDemographic clientPatientDemographic in clientPatientDemographics)
            {
                var clientPatientDemographicId = clientPatientDemographic.Id;
                PatientDemographic serverPatientDemographic = patientDemographics
                    .FirstOrDefault(p => p.Id == clientPatientDemographicId);

                if (serverPatientDemographic == null)
                {
                    _medicoContext.Set<PatientDemographic>().Add(clientPatientDemographic);
                }
                else
                {
                    serverPatientDemographic.FirstName = clientPatientDemographic.FirstName;
                    serverPatientDemographic.LastName = clientPatientDemographic.LastName;
                    serverPatientDemographic.DateOfBirth = clientPatientDemographic.DateOfBirth;
                    serverPatientDemographic.Gender = clientPatientDemographic.Gender;
                    serverPatientDemographic.IsDelete = clientPatientDemographic.IsDelete;
                    serverPatientDemographic.CompanyId = clientPatientDemographic.CompanyId;
                    serverPatientDemographic.MaritalStatus = clientPatientDemographic.MaritalStatus;
                    serverPatientDemographic.Ssn = clientPatientDemographic.Ssn;
                    serverPatientDemographic.MiddleName = clientPatientDemographic.MiddleName;
                    serverPatientDemographic.PrimaryAddress = clientPatientDemographic.PrimaryAddress;
                    serverPatientDemographic.SecondaryAddress = clientPatientDemographic.SecondaryAddress;
                    serverPatientDemographic.PrimaryPhone = clientPatientDemographic.PrimaryPhone;
                    serverPatientDemographic.SecondaryPhone = clientPatientDemographic.SecondaryPhone;
                    serverPatientDemographic.City = clientPatientDemographic.City;
                    serverPatientDemographic.State = clientPatientDemographic.State;
                    serverPatientDemographic.PatientInsuranceId = clientPatientDemographic.PatientInsuranceId;
                    serverPatientDemographic.Email = clientPatientDemographic.Email;
                    serverPatientDemographic.Zip = clientPatientDemographic.Zip;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region patient insurance

        [HttpPost]
        [Route("patientinsurance")]
        public async Task<IActionResult> PatientInsurance([FromBody]IEnumerable<PatientInsurance> clientPatientInsurances)
        {

            var patientInsurances = await _medicoContext.Set<PatientInsurance>()
                .ToListAsync();

            foreach (PatientInsurance clientPatientInsurance in clientPatientInsurances)
            {
                var clientPatientInsuranceId = clientPatientInsurance.Id;
                PatientInsurance serverPatientInsurance = patientInsurances
                    .FirstOrDefault(p => p.Id == clientPatientInsuranceId);

                if (serverPatientInsurance == null)
                {
                    _medicoContext.Set<PatientInsurance>()
                        .Add(clientPatientInsurance);
                }
                else
                {
                    serverPatientInsurance.FirstName = clientPatientInsurance.FirstName;
                    serverPatientInsurance.LastName = clientPatientInsurance.LastName;
                    serverPatientInsurance.DateOfBirth = clientPatientInsurance.DateOfBirth;
                    serverPatientInsurance.Gender = clientPatientInsurance.Gender;
                    serverPatientInsurance.IsDelete = clientPatientInsurance.IsDelete;
                    serverPatientInsurance.CaseNumber = clientPatientInsurance.CaseNumber;
                    serverPatientInsurance.RqId = clientPatientInsurance.RqId;
                    serverPatientInsurance.Ssn = clientPatientInsurance.Ssn;
                    serverPatientInsurance.MiddleName = clientPatientInsurance.MiddleName;
                    serverPatientInsurance.PrimaryAddress = clientPatientInsurance.PrimaryAddress;
                    serverPatientInsurance.SecondaryAddress = clientPatientInsurance.SecondaryAddress;
                    serverPatientInsurance.PrimaryPhone = clientPatientInsurance.PrimaryPhone;
                    serverPatientInsurance.SecondaryPhone = clientPatientInsurance.SecondaryPhone;
                    serverPatientInsurance.City = clientPatientInsurance.City;
                    serverPatientInsurance.State = clientPatientInsurance.State;
                    serverPatientInsurance.PatientDemographicId = clientPatientInsurance.PatientDemographicId;
                    serverPatientInsurance.Email = clientPatientInsurance.Email;
                    serverPatientInsurance.Zip = clientPatientInsurance.Zip;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region appointment

        [HttpPost]
        [Route("appointment")]
        public async Task<IActionResult> Appointment([FromBody]IEnumerable<Appointment> appointments)
        {
            var appointmentsFromDb = await _medicoContext.Set<Appointment>()
                .ToListAsync();

            foreach (var appointment in appointments)
            {
                var appointmentId = appointment.Id;
                var appointmentFromDb = appointmentsFromDb
                    .FirstOrDefault(a => a.Id == appointmentId);

                if (appointmentFromDb == null)
                {
                    _medicoContext.Set<Appointment>().Add(appointment);
                }
                else
                {
                    appointmentFromDb.IsDelete = appointment.IsDelete;
                    appointmentFromDb.AdmissionId = appointment.AdmissionId;
                    appointmentFromDb.LocationId = appointment.LocationId;
                    appointmentFromDb.NurseId = appointment.NurseId;
                    appointmentFromDb.PatientDemographicId = appointment.PatientDemographicId;
                    appointmentFromDb.PhysicianId = appointment.PhysicianId;
                    appointmentFromDb.RoomId = appointment.RoomId;
                    appointmentFromDb.CompanyId = appointment.CompanyId;
                    appointmentFromDb.StartDate = appointment.StartDate;
                    appointmentFromDb.EndDate = appointment.EndDate;
                    appointmentFromDb.AppointmentStatus = appointment.AppointmentStatus;
                    appointmentFromDb.Allegations = appointment.Allegations;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region location

        [HttpPost]
        [Route("location")]
        public async Task<IActionResult> Location([FromBody]IEnumerable<Location> clientLocations)
        {

            var locations = await _medicoContext.Set<Location>().ToListAsync();

            foreach (var clientLocation in clientLocations)
            {
                var locationId = clientLocation.Id;
                var serverLocation = locations
                    .FirstOrDefault(l => l.Id == locationId);

                if (serverLocation == null)
                {
                    _medicoContext.Set<Location>().Add(clientLocation);
                }
                else
                {
                    serverLocation.IsActive = clientLocation.IsActive;
                    serverLocation.CompanyId = clientLocation.CompanyId;
                    serverLocation.Name = clientLocation.Name;
                    serverLocation.Address = clientLocation.Address;
                    serverLocation.SecondaryAddress = clientLocation.SecondaryAddress;
                    serverLocation.City = clientLocation.City;
                    serverLocation.State = clientLocation.State;
                    serverLocation.Zip = clientLocation.Zip;
                    serverLocation.Fax = clientLocation.Fax;
                    serverLocation.Phone = clientLocation.Phone;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region room

        [HttpPost]
        [Route("room")]
        public async Task<IActionResult> Room([FromBody]IEnumerable<Room> clientRooms)
        {
            var rooms = await _medicoContext.Set<Room>().ToListAsync();

            foreach (var clientRoom in clientRooms)
            {
                var roomId = clientRoom.Id;
                var serverRoom = rooms.FirstOrDefault(l => l.Id == roomId);
                if (serverRoom == null)
                {
                    _medicoContext.Set<Room>().Add(clientRoom);
                }
                else
                {
                    serverRoom.IsActive = clientRoom.IsActive;
                    serverRoom.LocationId = clientRoom.LocationId;
                    serverRoom.Name = clientRoom.Name;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region employee


        [HttpPost]
        [Route("employee")]
        public async Task<IActionResult> Employee([FromBody]IEnumerable<Employee> clientEmployees)
        {
            var employees = await _medicoContext.Set<Employee>().ToListAsync();

            foreach (var clientEmployee in clientEmployees)
            {
                var clientEmployeeId = clientEmployee.Id;
                var serverEmployee = employees
                    .FirstOrDefault(l => l.Id == clientEmployeeId);

                if (serverEmployee == null)
                {
                    _medicoContext.Set<Employee>().Add(clientEmployee);
                }
                else
                {
                    serverEmployee.IsActive = clientEmployee.IsActive;
                    serverEmployee.CompanyId = clientEmployee.CompanyId;
                    serverEmployee.FirstName = clientEmployee.FirstName;
                    serverEmployee.MiddleName = clientEmployee.MiddleName;
                    serverEmployee.LastName = clientEmployee.LastName;
                    serverEmployee.Address = clientEmployee.Address;
                    serverEmployee.SecondaryAddress = clientEmployee.SecondaryAddress;
                    serverEmployee.City = clientEmployee.City;
                    serverEmployee.State = clientEmployee.State;
                    serverEmployee.Zip = clientEmployee.Zip;
                    serverEmployee.PrimaryPhone = clientEmployee.PrimaryPhone;
                    serverEmployee.SecondaryPhone = clientEmployee.SecondaryPhone;
                    serverEmployee.EmployeeType = clientEmployee.EmployeeType;
                    serverEmployee.Ssn = clientEmployee.Ssn;
                    serverEmployee.Gender = clientEmployee.Gender;
                    serverEmployee.DateOfBirth = clientEmployee.DateOfBirth;
                    serverEmployee.NameSuffix = clientEmployee.NameSuffix;
                    serverEmployee.NamePrefix = clientEmployee.NamePrefix;
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        #region signature info

        [HttpPost]
        [Route("signatureinfo")]
        public async Task<IActionResult> SignatureInfo([FromBody]IEnumerable<SignatureInfo> signatureInfos)
        {
            try
            {
                var signatureInfosFromDb = await _medicoContext.Set<SignatureInfo>()
                    .ToListAsync();
                foreach (var signatureInfo in signatureInfos)
                {
                    var templateTypeId = signatureInfo.Id;
                    var templateTypeDb = signatureInfosFromDb.FirstOrDefault(i => i.Id == templateTypeId);
                    if (templateTypeDb == null)
                    {
                        _medicoContext.Set<SignatureInfo>()
                            .Add(signatureInfo);
                    }
                    else
                    {
                        templateTypeDb.SignDate = signatureInfo.SignDate;
                        templateTypeDb.AdmissionId = signatureInfo.AdmissionId;
                        templateTypeDb.EmployeeId = signatureInfo.EmployeeId;
                        templateTypeDb.IsUnsigned = signatureInfo.IsUnsigned;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region admission

        [HttpPost]
        [Route("admission")]
        public async Task<IActionResult> Admission([FromBody]IEnumerable<Admission> admissions)
        {
            try
            {
                var admissionsFromDb = await _medicoContext.Set<Admission>()
                    .ToListAsync();
                foreach (var clientAdmission in admissions)
                {
                    var admissionId = clientAdmission.Id;
                    var serverAdmission = admissionsFromDb.FirstOrDefault(l => l.Id == admissionId);
                    if (serverAdmission == null)
                    {
                        _medicoContext.Set<Admission>().Add(clientAdmission);
                    }
                    else
                    {
                        serverAdmission.IsDelete = clientAdmission.IsDelete;
                        serverAdmission.PatientDemographicId = clientAdmission.PatientDemographicId;
                        serverAdmission.AppointmentId = clientAdmission.AppointmentId;
                        serverAdmission.AdmissionData = clientAdmission.AdmissionData;
                        serverAdmission.CreatedDate = clientAdmission.CreatedDate;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template lookup item category

        [HttpPost]
        [Route("templatelookupitemcategory")]
        public async Task<IActionResult> TemplateLookupItemCategory([FromBody]IEnumerable<TemplateLookupItemCategory> categories)
        {
            try
            {
                var categoriesFromDb = await _medicoContext.Set<TemplateLookupItemCategory>()
                    .ToListAsync();
                foreach (var category in categories)
                {
                    var categoryId = category.Id;

                    var categoryFromDb = categoriesFromDb.FirstOrDefault(c => c.Id == categoryId);
                    if (categoryFromDb == null)
                    {
                        _medicoContext.Set<TemplateLookupItemCategory>().Add(category);
                    }
                    else
                    {
                        categoryFromDb.IsActive = category.IsActive;
                        categoryFromDb.Name = category.Name;
                        categoryFromDb.Title = category.Title;
                    }
                }

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template type

        [HttpPost]
        [Route("templatetype")]
        public async Task<IActionResult> TemplateType([FromBody]IEnumerable<TemplateType> templateTypes)
        {
            try
            {
                var templateTypesFromDb = await _medicoContext.Set<TemplateType>()
                    .ToListAsync();
                foreach (var templateType in templateTypes)
                {
                    var templateTypeId = templateType.Id;
                    var templateTypeDb = templateTypesFromDb.FirstOrDefault(i => i.Id == templateTypeId);
                    if (templateTypeDb == null)
                    {
                        _medicoContext.Set<TemplateType>()
                            .Add(templateType);
                    }
                    else
                    {
                        templateTypeDb.IsActive = templateType.IsActive;
                        templateTypeDb.Name = templateType.Name;
                        templateTypeDb.CompanyId = templateType.CompanyId;
                        templateTypeDb.Title = templateType.Title;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template lookup item

        [HttpPost]
        [Route("templatelookupitem")]
        public async Task<IActionResult> TemplateLookItem([FromBody]IEnumerable<TemplateLookupItem> templateLookupItems)
        {
            try
            {
                var lookupItemsFromDb = await _medicoContext.Set<TemplateLookupItem>()
                    .ToListAsync();
                foreach (var lookupItem in templateLookupItems)
                {
                    var lookupItemId = lookupItem.Id;
                    var lookupItemFromDb = lookupItemsFromDb
                        .FirstOrDefault(i => i.Id == lookupItemId);

                    if (lookupItemFromDb == null)
                    {
                        _medicoContext.Set<TemplateLookupItem>().Add(lookupItem);
                    }
                    else
                    {
                        lookupItemFromDb.IsActive = lookupItem.IsActive;
                        lookupItemFromDb.Name = lookupItem.Name;
                        lookupItemFromDb.JsonValues = lookupItem.JsonValues;
                        lookupItemFromDb.TemplateLookupItemCategoryId = lookupItem.TemplateLookupItemCategoryId;
                        lookupItemFromDb.CompanyId = lookupItem.CompanyId;
                        lookupItemFromDb.Title = lookupItem.Title;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template

        [HttpPost]
        [Route("template")]
        public async Task<IActionResult> Template([FromBody]IEnumerable<Template> templates)
        {
            try
            {
                var templatesFromDb = await _medicoContext.Set<Template>()
                    .ToListAsync();
                foreach (var template in templates)
                {
                    var templateId = template.Id;
                    var lookupItemFromDb = templatesFromDb
                        .FirstOrDefault(i => i.Id == templateId);

                    if (lookupItemFromDb == null)
                    {
                        _medicoContext.Set<Template>().Add(template);
                    }
                    else
                    {
                        lookupItemFromDb.IsActive = template.IsActive;
                        lookupItemFromDb.Name = template.Name;
                        lookupItemFromDb.Title = template.Title;
                        lookupItemFromDb.Value = template.Value;
                        lookupItemFromDb.CompanyId = template.CompanyId;
                        lookupItemFromDb.TemplateTypeId = template.TemplateTypeId;
                        lookupItemFromDb.IsRequired = template.IsRequired;
                        lookupItemFromDb.DetailedTemplateHtml = template.DetailedTemplateHtml;
                        lookupItemFromDb.DefaultTemplateHtml = template.DefaultTemplateHtml;
                        lookupItemFromDb.TemplateOrder = template.TemplateOrder;
                        lookupItemFromDb.IsHistorical = template.IsHistorical;
                        lookupItemFromDb.ReportTitle = template.ReportTitle;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region medical record history

        [HttpPost]
        [Route("medicalrecord")]
        public async Task<IActionResult> MedicalRecord([FromBody]IEnumerable<MedicalRecord> medicalRecords)
        {
            try
            {
                var medicalRecordFromDb = await _medicoContext.Set<MedicalRecord>()
                    .ToListAsync();
                foreach (var medicalRecord in medicalRecords)
                {
                    var medicalHistoryId = medicalRecord.Id;
                    var medicalHistoryFromDb = medicalRecordFromDb.FirstOrDefault(i => i.Id == medicalHistoryId);
                    if (medicalHistoryFromDb == null)
                    {
                        _medicoContext.Set<MedicalRecord>().Add(medicalRecord);
                    }
                    else
                    {
                        medicalHistoryFromDb.IsDelete = medicalRecord.IsDelete;
                        medicalHistoryFromDb.Diagnosis = medicalRecord.Diagnosis;
                        medicalHistoryFromDb.PatientId = medicalRecord.PatientId;
                        medicalHistoryFromDb.CreatedDate = medicalRecord.CreatedDate;
                        medicalHistoryFromDb.Notes = medicalRecord.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region medical history

        [HttpPost]
        [Route("medicalhistory")]
        public async Task<IActionResult> MedicalHistory([FromBody]IEnumerable<MedicalHistory> medicalHistories)
        {
            try
            {
                var medicalHistoriesFromDb = await _medicoContext.Set<MedicalHistory>()
                    .ToListAsync();
                foreach (var medicalHistory in medicalHistories)
                {
                    var medicalHistoryId = medicalHistory.Id;
                    var medicalHistoryFromDb = medicalHistoriesFromDb.FirstOrDefault(i => i.Id == medicalHistoryId);
                    if (medicalHistoryFromDb == null)
                    {
                        _medicoContext.Set<MedicalHistory>().Add(medicalHistory);
                    }
                    else
                    {
                        medicalHistoryFromDb.IsDelete = medicalHistory.IsDelete;
                        medicalHistoryFromDb.Diagnosis = medicalHistory.Diagnosis;
                        medicalHistoryFromDb.PatientId = medicalHistory.PatientId;
                        medicalHistoryFromDb.CreatedDate = medicalHistory.CreatedDate;
                        medicalHistoryFromDb.Notes = medicalHistory.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region surgical history

        [HttpPost]
        [Route("surgicalhistory")]
        public async Task<IActionResult> SurgicalHistory([FromBody]IEnumerable<SurgicalHistory> surgicalHistories)
        {
            try
            {
                var surgicalHistoriesFromDb = await _medicoContext.Set<SurgicalHistory>()
                    .ToListAsync();
                foreach (var surgicalHistory in surgicalHistories)
                {
                    var surgicalHistoryId = surgicalHistory.Id;
                    var surgicalHistoryFromDb = surgicalHistoriesFromDb
                        .FirstOrDefault(i => i.Id == surgicalHistoryId);

                    if (surgicalHistoryFromDb == null)
                    {
                        _medicoContext.Set<SurgicalHistory>().Add(surgicalHistory);
                    }
                    else
                    {
                        surgicalHistoryFromDb.IsDelete = surgicalHistory.IsDelete;
                        surgicalHistoryFromDb.Diagnosis = surgicalHistory.Diagnosis;
                        surgicalHistoryFromDb.PatientId = surgicalHistory.PatientId;
                        surgicalHistoryFromDb.CreatedDate = surgicalHistory.CreatedDate;
                        surgicalHistoryFromDb.Notes = surgicalHistory.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region chief complaint template

        [Route("chiefcomplainttemplate")]
        [HttpPost]
        public async Task<IActionResult> ChiefComplaintTemplate([FromBody]IEnumerable<ChiefComplaintTemplate> chiefComplaintTemplates)
        {
            try
            {
                var chiefComplaintTemplatesFromDb = await _medicoContext.Set<ChiefComplaintTemplate>()
                    .ToListAsync();

                foreach (var chefChiefComplaintTemplate in chiefComplaintTemplates)
                {
                    var chiefComplaintId = chefChiefComplaintTemplate.ChiefComplaintId;
                    var templateId = chefChiefComplaintTemplate.TemplateId;

                    var chefChiefComplaintTemplatesFromDb = chiefComplaintTemplatesFromDb
                        .FirstOrDefault(i => i.ChiefComplaintId == chiefComplaintId && i.TemplateId == templateId);

                    if (chefChiefComplaintTemplatesFromDb == null)
                    {
                        _medicoContext.Set<ChiefComplaintTemplate>().Add(chefChiefComplaintTemplate);
                    }
                    else
                    {
                        chefChiefComplaintTemplatesFromDb.IsDelete = chefChiefComplaintTemplate.IsDelete;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region family history

        [HttpPost]
        [Route("familyhistory")]
        public async Task<IActionResult> FamilyHistory([FromBody]IEnumerable<FamilyHistory> familyHistories)
        {
            try
            {
                var familyHistoriesFromDb = await _medicoContext.Set<FamilyHistory>()
                    .ToListAsync();
                foreach (var familyHistory in familyHistories)
                {
                    var familyHistoryId = familyHistory.Id;
                    var familyHistoryFromDb = familyHistoriesFromDb.FirstOrDefault(i => i.Id == familyHistoryId);
                    if (familyHistoryFromDb == null)
                    {
                        _medicoContext.Set<FamilyHistory>().Add(familyHistory);
                    }
                    else
                    {
                        familyHistoryFromDb.IsDelete = familyHistory.IsDelete;
                        familyHistoryFromDb.Notes = familyHistory.Notes;
                        familyHistoryFromDb.Diagnosis = familyHistory.Diagnosis;
                        familyHistoryFromDb.PatientId = familyHistory.PatientId;
                        familyHistoryFromDb.CreatedDate = familyHistory.CreatedDate;
                        familyHistoryFromDb.FamilyMember = familyHistory.FamilyMember;
                        familyHistoryFromDb.FamilyStatus = familyHistory.FamilyStatus;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region education history

        [HttpPost]
        [Route("educationhistory")]
        public async Task<IActionResult> EducationHistory([FromBody]IEnumerable<EducationHistory> educationHistories)
        {
            try
            {
                var educationHistoriesFromDb = await _medicoContext.Set<EducationHistory>()
                    .ToListAsync();
                foreach (var educationHistory in educationHistories)
                {
                    var educationHistoryId = educationHistory.Id;
                    var educationHistoryFromDb = educationHistoriesFromDb
                        .FirstOrDefault(i => i.Id == educationHistoryId);

                    if (educationHistoryFromDb == null)
                    {
                        _medicoContext.Set<EducationHistory>().Add(educationHistory);
                    }
                    else
                    {
                        educationHistoryFromDb.IsDelete = educationHistory.IsDelete;
                        educationHistoryFromDb.Degree = educationHistory.Degree;
                        educationHistoryFromDb.PatientId = educationHistory.PatientId;
                        educationHistoryFromDb.CreatedDate = educationHistory.CreatedDate;
                        educationHistoryFromDb.YearCompleted = educationHistory.YearCompleted;
                        educationHistoryFromDb.Notes = educationHistory.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region drug history

        [HttpPost]
        [Route("drughistory")]
        public async Task<IActionResult> DrugHistory([FromBody]IEnumerable<DrugHistory> drugHistories)
        {
            try
            {
                var drugHistoriesFromDb = await _medicoContext
                  .Set<DrugHistory>()
                  .ToListAsync();

                foreach (var drugHistory in drugHistories)
                {
                    var drugHistoryId = drugHistory.Id;
                    var drugHistoryFromDb = drugHistoriesFromDb
                      .FirstOrDefault(i => i.Id == drugHistoryId);

                    if (drugHistoryFromDb == null)
                    {
                        _medicoContext.Set<DrugHistory>()
                          .Add(drugHistory);
                    }
                    else
                    {
                        drugHistoryFromDb.IsDelete = drugHistory.IsDelete;
                        drugHistoryFromDb.Id = drugHistory.Id;
                        drugHistoryFromDb.PatientId = drugHistory.PatientId;
                        drugHistoryFromDb.Amount = drugHistory.Amount;
                        drugHistoryFromDb.Duration = drugHistory.Duration;
                        drugHistoryFromDb.Frequency = drugHistory.Frequency;
                        drugHistoryFromDb.Length = drugHistory.Length;
                        drugHistoryFromDb.Notes = drugHistory.Notes;
                        drugHistoryFromDb.Quit = drugHistory.Quit;
                        drugHistoryFromDb.Status = drugHistory.Status;
                        drugHistoryFromDb.StatusLength = drugHistory.StatusLength;
                        drugHistoryFromDb.Use = drugHistory.Use;
                        drugHistoryFromDb.Type = drugHistory.Type;
                        drugHistoryFromDb.StatusLengthType = drugHistory.StatusLengthType;
                        drugHistoryFromDb.Route = drugHistory.Route;
                        drugHistoryFromDb.CreateDate = drugHistory.CreateDate;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region alcohol history

        [HttpPost]
        [Route("alcoholhistory")]
        public async Task<IActionResult> AlcoholHistory([FromBody]IEnumerable<AlcoholHistory> alcoholHistories)
        {
            try
            {
                var alcoholHistoriesFromDb = await _medicoContext
                  .Set<AlcoholHistory>()
                  .ToListAsync();

                foreach (var alcoholHistory in alcoholHistories)
                {
                    var alcoholHistoryId = alcoholHistory.Id;
                    var alcoholHistoryFromDb = alcoholHistoriesFromDb
                      .FirstOrDefault(i => i.Id == alcoholHistoryId);

                    if (alcoholHistoryFromDb == null)
                    {
                        _medicoContext.Set<AlcoholHistory>()
                          .Add(alcoholHistory);
                    }
                    else
                    {
                        alcoholHistoryFromDb.IsDelete = alcoholHistory.IsDelete;
                        alcoholHistoryFromDb.Id = alcoholHistory.Id;
                        alcoholHistoryFromDb.PatientId = alcoholHistory.PatientId;
                        alcoholHistoryFromDb.Amount = alcoholHistory.Amount;
                        alcoholHistoryFromDb.Duration = alcoholHistory.Duration;
                        alcoholHistoryFromDb.Frequency = alcoholHistory.Frequency;
                        alcoholHistoryFromDb.Length = alcoholHistory.Length;
                        alcoholHistoryFromDb.Notes = alcoholHistory.Notes;
                        alcoholHistoryFromDb.Quit = alcoholHistory.Quit;
                        alcoholHistoryFromDb.Status = alcoholHistory.Status;
                        alcoholHistoryFromDb.StatusLength = alcoholHistory.StatusLength;
                        alcoholHistoryFromDb.Use = alcoholHistory.Use;
                        alcoholHistoryFromDb.Type = alcoholHistory.Type;
                        alcoholHistoryFromDb.StatusLengthType = alcoholHistory.StatusLengthType;
                        alcoholHistoryFromDb.CreateDate = alcoholHistory.CreateDate;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region tobacco history

        [HttpPost]
        [Route("tobaccohistory")]
        public async Task<IActionResult> TobaccoHistory([FromBody]IEnumerable<TobaccoHistory> tobaccoHistories)
        {
            try
            {
                var tobaccoHistoriesFromDb = await _medicoContext.Set<TobaccoHistory>()
                    .ToListAsync();
                foreach (var tobaccoHistory in tobaccoHistories)
                {
                    var tobaccoHistoryId = tobaccoHistory.Id;
                    var tobaccoHistoryFromDb = tobaccoHistoriesFromDb
                      .FirstOrDefault(i => i.Id == tobaccoHistoryId);

                    if (tobaccoHistoryFromDb == null)
                    {
                        _medicoContext.Set<TobaccoHistory>()
                          .Add(tobaccoHistory);
                    }
                    else
                    {
                        tobaccoHistoryFromDb.IsDelete = tobaccoHistory.IsDelete;
                        tobaccoHistoryFromDb.Id = tobaccoHistory.Id;
                        tobaccoHistoryFromDb.PatientId = tobaccoHistory.PatientId;
                        tobaccoHistoryFromDb.Amount = tobaccoHistory.Amount;
                        tobaccoHistoryFromDb.Duration = tobaccoHistory.Duration;
                        tobaccoHistoryFromDb.Frequency = tobaccoHistory.Frequency;
                        tobaccoHistoryFromDb.Length = tobaccoHistory.Length;
                        tobaccoHistoryFromDb.Notes = tobaccoHistory.Notes;
                        tobaccoHistoryFromDb.Quit = tobaccoHistory.Quit;
                        tobaccoHistoryFromDb.Status = tobaccoHistory.Status;
                        tobaccoHistoryFromDb.StatusLength = tobaccoHistory.StatusLength;
                        tobaccoHistoryFromDb.Use = tobaccoHistory.Use;
                        tobaccoHistoryFromDb.Type = tobaccoHistory.Type;
                        tobaccoHistoryFromDb.CreateDate = tobaccoHistory.CreateDate;
                        tobaccoHistoryFromDb.StatusLengthType = tobaccoHistory.StatusLengthType;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region occupational history

        [HttpPost]
        [Route("occupationalhistory")]
        public async Task<IActionResult> OccupationalHistory([FromBody]IEnumerable<OccupationalHistory> occupationalHistories)
        {
            try
            {
                var occupationalHistoriesFromDb = await _medicoContext.Set<OccupationalHistory>()
                    .ToListAsync();
                foreach (var occupationalHistory in occupationalHistories)
                {
                    var occupationalHistoryId = occupationalHistory.Id;
                    var educationHistoryFromDb = occupationalHistoriesFromDb
                        .FirstOrDefault(i => i.Id == occupationalHistoryId);

                    if (educationHistoryFromDb == null)
                    {
                        _medicoContext.Set<OccupationalHistory>().Add(occupationalHistory);
                    }
                    else
                    {
                        educationHistoryFromDb.IsDelete = occupationalHistory.IsDelete;
                        educationHistoryFromDb.EmploymentStatus = occupationalHistory.EmploymentStatus;
                        educationHistoryFromDb.DisabilityClaimDetails = occupationalHistory.DisabilityClaimDetails;
                        educationHistoryFromDb.WorkersCompensationClaimDetails = occupationalHistory.WorkersCompensationClaimDetails;
                        educationHistoryFromDb.OccupationalType = occupationalHistory.OccupationalType;
                        educationHistoryFromDb.End = occupationalHistory.End;
                        educationHistoryFromDb.Start = occupationalHistory.Start;
                        educationHistoryFromDb.PatientId = occupationalHistory.PatientId;
                        educationHistoryFromDb.CreatedDate = occupationalHistory.CreatedDate;
                        educationHistoryFromDb.Notes = occupationalHistory.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region allergy

        [HttpPost]
        [Route("allergy")]
        public async Task<IActionResult> Allergy([FromBody]IEnumerable<Allergy> allergies)
        {
            try
            {
                var allergiesFromDb = await _medicoContext.Set<Allergy>()
                    .ToListAsync();
                foreach (var allergy in allergies)
                {
                    var allergyId = allergy.Id;
                    var allergyFromDb = allergiesFromDb.FirstOrDefault(i => i.Id == allergyId);
                    if (allergyFromDb == null)
                    {
                        _medicoContext.Set<Allergy>().Add(allergy);
                    }
                    else
                    {
                        allergyFromDb.IsDelete = allergy.IsDelete;
                        allergyFromDb.PatientId = allergy.PatientId;
                        allergyFromDb.CreatedDate = allergy.CreatedDate;
                        allergyFromDb.Medication = allergy.Medication;
                        allergyFromDb.Reaction = allergy.Reaction;
                        allergyFromDb.Notes = allergy.Notes;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region medication history

        [HttpPost]
        [Route("medicationhistory")]
        public async Task<IActionResult> MedicationHistory([FromBody]IEnumerable<MedicationHistory> medicationHistory)
        {
            try
            {
                var medicationHistoryFromDb = await _medicoContext.Set<MedicationHistory>()
                    .ToListAsync();
                foreach (var patientMedicationHistory in medicationHistory)
                {
                    var medicationHistoryId = patientMedicationHistory.Id;
                    var allergyFromDb = medicationHistoryFromDb
                        .FirstOrDefault(i => i.Id == medicationHistoryId);

                    if (allergyFromDb == null)
                    {
                        _medicoContext.Set<MedicationHistory>().Add(patientMedicationHistory);
                    }
                    else
                    {
                        allergyFromDb.IsDelete = patientMedicationHistory.IsDelete;
                        allergyFromDb.PatientId = patientMedicationHistory.PatientId;
                        allergyFromDb.CreatedDate = patientMedicationHistory.CreatedDate;
                        allergyFromDb.Medication = patientMedicationHistory.Medication;
                        allergyFromDb.Dose = patientMedicationHistory.Dose;
                        allergyFromDb.Route = patientMedicationHistory.Route;
                        allergyFromDb.DoseSchedule = patientMedicationHistory.DoseSchedule;
                        allergyFromDb.Units = patientMedicationHistory.Units;
                        allergyFromDb.MedicationStatus = patientMedicationHistory.MedicationStatus;
                        allergyFromDb.Prn = patientMedicationHistory.Prn;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region chief complaint

        [HttpPost]
        [Route("chiefcomplaint")]
        public async Task<IActionResult> ChiefComplaint([FromBody]IEnumerable<ChiefComplaint> chiefComplaints)
        {
            try
            {
                var chiefComplaintsFromDb = await _medicoContext.Set<ChiefComplaint>()
                    .ToListAsync();
                foreach (var chiefComplaint in chiefComplaints)
                {
                    var chiefComplaintId = chiefComplaint.Id;
                    var chiefComplaintFromDb = chiefComplaintsFromDb
                        .FirstOrDefault(i => i.Id == chiefComplaintId);

                    if (chiefComplaintFromDb == null)
                    {
                        _medicoContext.Set<ChiefComplaint>().Add(chiefComplaint);
                    }
                    else
                    {
                        chiefComplaintFromDb.IsDelete = chiefComplaint.IsDelete;
                        chiefComplaintFromDb.CompanyId = chiefComplaint.CompanyId;
                        chiefComplaintFromDb.Name = chiefComplaint.Name;
                        chiefComplaintFromDb.Title = chiefComplaint.Title;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region app user

        [HttpPost]
        [Route("appuser")]
        public async Task<IActionResult> AppUser([FromBody]IEnumerable<AppUser> users)
        {
            try
            {
                var usersFromDb = await _medicoContext.Set<AppUser>()
                    .ToListAsync();
                foreach (var user in users)
                {
                    var userId = user.Id;
                    var chiefComplaintFromDb = usersFromDb
                        .FirstOrDefault(i => i.Id == userId);

                    if (chiefComplaintFromDb == null)
                    {
                        _medicoContext.Set<AppUser>().Add(user);
                    }
                    else
                    {
                        chiefComplaintFromDb.IsDelete = user.IsDelete;
                        chiefComplaintFromDb.Hash = user.Hash;
                        chiefComplaintFromDb.IsSuperAdmin = user.IsSuperAdmin;
                        chiefComplaintFromDb.Login = user.Login;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region permission group

        [HttpPost]
        [Route("permissiongroup")]
        public async Task<IActionResult> PermissionGroup([FromBody]IEnumerable<PermissionGroup> permissionGroups)
        {
            try
            {
                var permissionGroupsFromDb = await _medicoContext.Set<PermissionGroup>()
                    .ToListAsync();
                foreach (var permissionGroup in permissionGroups)
                {
                    var groupId = permissionGroup.Id;
                    var permissionGroupFromDb = permissionGroupsFromDb
                        .FirstOrDefault(i => i.Id == groupId);

                    if (permissionGroupFromDb == null)
                    {
                        _medicoContext.Set<PermissionGroup>().Add(permissionGroup);
                    }
                    else
                    {
                        permissionGroupFromDb.IsDelete = permissionGroup.IsDelete;
                        permissionGroupFromDb.Name = permissionGroup.Name;
                        permissionGroupFromDb.Permissions = permissionGroup.Permissions;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region app user permission group

        [HttpPost]
        [Route("appuserpermissiongroup")]
        public async Task<IActionResult> AppUserPermissionGroup([FromBody]IEnumerable<AppUserPermissionGroup> userPermissionGroups)
        {
            if (userPermissionGroups == null)
                throw new ArgumentNullException(nameof(userPermissionGroups));
            try
            {
                //in case when we have only one entity - conside create action
                var isCreateAction = userPermissionGroups.Count() == 1;
                if (isCreateAction)
                {
                    var userPermissionGroup = userPermissionGroups.First();
                    var userPermissionGroupFromDb = await _medicoContext
                        .Set<AppUserPermissionGroup>().FirstOrDefaultAsync(u =>
                            u.AppUserId == userPermissionGroup.AppUserId
                            && u.PermissionGroupId == userPermissionGroup.PermissionGroupId);

                    if (userPermissionGroupFromDb == null)
                    {
                        _medicoContext.Add(userPermissionGroup);
                    }
                }
                else
                {
                    var userPermissionGroupsFromDb = await _medicoContext.Set<AppUserPermissionGroup>()
                        .ToListAsync();
                    _medicoContext.Set<AppUserPermissionGroup>().RemoveRange(userPermissionGroupsFromDb);

                    _medicoContext.AddRange(userPermissionGroups);
                }

                await _medicoContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region extra field

        [HttpPost]
        [Route("extrafield")]
        public async Task<IActionResult> ExtraField([FromBody]IEnumerable<ExtraField> extraFields)
        {
            try
            {
                var fieldsFromDb = await _medicoContext.Set<ExtraField>()
                    .ToListAsync();
                foreach (var extraField in extraFields)
                {
                    var extraFieldId = extraField.Id;
                    var extraFieldFromDb = fieldsFromDb
                        .FirstOrDefault(i => i.Id == extraFieldId);

                    if (extraFieldFromDb == null)
                    {
                        _medicoContext.Set<ExtraField>().Add(extraField);
                    }
                    else
                    {
                        extraFieldFromDb.Title = extraField.Title;
                        extraFieldFromDb.Name = extraField.Name;
                        extraFieldFromDb.RelatedEntityName = extraField.RelatedEntityName;
                        extraFieldFromDb.Type = extraField.Type;
                        extraFieldFromDb.IsActive = extraField.IsActive;
                        extraFieldFromDb.ShowInList = extraField.ShowInList;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region entity extra field map

        [HttpPost]
        [Route("entityextrafieldmap")]
        public async Task<IActionResult> EntityExtraFieldMap([FromBody]IEnumerable<EntityExtraFieldMap> extraFieldMaps)
        {
            try
            {
                var entityExtraFieldMapsFromDb = await _medicoContext.Set<EntityExtraFieldMap>()
                    .ToListAsync();
                foreach (var extraFieldMap in extraFieldMaps)
                {
                    var entityId = extraFieldMap.EntityId;
                    var extraFieldId = extraFieldMap.ExtraFieldId;
                    var extraFieldMapDb = entityExtraFieldMapsFromDb.FirstOrDefault(i =>
                        i.EntityId == entityId && i.ExtraFieldId == extraFieldId);
                    if (extraFieldMapDb == null)
                    {
                        _medicoContext.Set<EntityExtraFieldMap>().Add(extraFieldMap);
                    }
                    else
                    {
                        extraFieldMapDb.Value = extraFieldMap.Value;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region company

        [HttpPost]
        [Route("company")]
        public async Task<IActionResult> Company([FromBody]IEnumerable<Company> companies)
        {
            try
            {
                var companiesFromDb = await _medicoContext.Set<Company>()
                    .ToListAsync();
                foreach (var сompany in companies)
                {
                    var companyId = сompany.Id;
                    var companyFromDb = companiesFromDb.FirstOrDefault(i => i.Id == companyId);
                    if (companyFromDb == null)
                    {
                        _medicoContext.Set<Company>().Add(сompany);
                    }
                    else
                    {
                        companyFromDb.WebSiteUrl = сompany.WebSiteUrl;
                        companyFromDb.Name = сompany.Name;
                        companyFromDb.Address = сompany.Address;
                        companyFromDb.SecondaryAddress = сompany.SecondaryAddress;
                        companyFromDb.City = сompany.City;
                        companyFromDb.Fax = сompany.Fax;
                        companyFromDb.State = сompany.State;
                        companyFromDb.ZipCode = сompany.ZipCode;
                        companyFromDb.Phone = сompany.Phone;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region chief complaint keyword

        [Route("chiefcomplaintkeyword")]
        [HttpPost]
        public async Task<IActionResult> ChiefComplaintKeyword([FromBody]IEnumerable<ChiefComplaintKeyword> chiefComplaintKeywords)
        {
            try
            {
                var chiefComplaintKeywordFromDb = await _medicoContext.Set<ChiefComplaintKeyword>()
                    .ToListAsync();
                foreach (var keyword in chiefComplaintKeywords)
                {
                    var keywordId = keyword.Id;
                    var companyFromDb = chiefComplaintKeywordFromDb
                        .FirstOrDefault(i => i.Id == keywordId);

                    if (companyFromDb == null)
                    {
                        _medicoContext.Set<ChiefComplaintKeyword>().Add(keyword);
                    }
                    else
                    {
                        companyFromDb.Value = keyword.Value;
                        companyFromDb.IsDelete = keyword.IsDelete;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region chief complaint related keyword

        [Route("chiefcomplaintrelatedkeyword")]
        [HttpPost]
        public async Task<IActionResult> ChiefComplaintRelatedKeyword([FromBody]IEnumerable<ChiefComplaintRelatedKeyword> chiefComplaintRelatedKeywords)
        {
            try
            {
                var chiefComplaintRelatedKeywordsFromDb = await _medicoContext.Set<ChiefComplaintRelatedKeyword>()
                    .ToListAsync();

                foreach (var chiefComplaintRelatedKeyword in chiefComplaintRelatedKeywords)
                {
                    var chiefComplaintId = chiefComplaintRelatedKeyword.ChiefComplaintId;
                    var keywordId = chiefComplaintRelatedKeyword.KeywordId;

                    var chiefComplaintRelatedKeywordFromDb = chiefComplaintRelatedKeywordsFromDb
                        .FirstOrDefault(i => i.ChiefComplaintId == chiefComplaintId && i.KeywordId == keywordId);

                    if (chiefComplaintRelatedKeywordFromDb == null)
                    {
                        _medicoContext.Set<ChiefComplaintRelatedKeyword>().Add(chiefComplaintRelatedKeyword);
                    }
                    else
                    {
                        chiefComplaintRelatedKeywordFromDb.IsDelete = chiefComplaintRelatedKeyword.IsDelete;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region template lookup item tracker

        [HttpPost]
        [Route("templatelookupitemtracker")]
        public async Task<IActionResult> TemplateLookupItemTracker([FromBody]IEnumerable<TemplateLookupItemTracker> templateLookupItemTrackers)
        {
            try
            {
                var templateLookupItemTrackersFromDb = await _medicoContext.Set<TemplateLookupItemTracker>()
                    .ToListAsync();

                foreach (var templateLookupItemTracker in templateLookupItemTrackers)
                {
                    var templateId = templateLookupItemTracker.TemplateId;
                    var templateLookupItemId = templateLookupItemTracker.TemplateLookupItemId;

                    var templateLookupItemTrackerFromDb = templateLookupItemTrackersFromDb
                        .FirstOrDefault(i => i.TemplateLookupItemId == templateLookupItemId && i.TemplateId == templateId);

                    if (templateLookupItemTrackerFromDb == null)
                    {
                        _medicoContext.Set<TemplateLookupItemTracker>()
                            .Add(templateLookupItemTracker);
                    }
                    else
                    {
                        templateLookupItemTrackerFromDb.NumberOfLookupItemsInTemplate =
                            templateLookupItemTracker.NumberOfLookupItemsInTemplate;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region lookup item

        [Route("lookupitem")]
        [HttpPost]
        public async Task<IActionResult> LookupItem([FromBody]IEnumerable<LookupItem> lookupItems)
        {
            try
            {
                var lookupItemsFromDb = await _medicoContext.Set<LookupItem>()
                    .ToListAsync();
                foreach (var lookupItem in lookupItems)
                {
                    var lookupItemId = lookupItem.Id;
                    var lookupItemFromDb = lookupItemsFromDb.FirstOrDefault(i => i.Id == lookupItemId);
                    if (lookupItemFromDb == null)
                    {
                        _medicoContext.Set<LookupItem>().Add(lookupItem);
                    }
                    else
                    {
                        lookupItemFromDb.Value = lookupItem.Value;
                        lookupItemFromDb.LookupItemCollectionId = lookupItem.LookupItemCollectionId;
                        lookupItemFromDb.IsDelete = lookupItem.IsDelete;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region lookup item collection

        [Route("lookupitemcollection")]
        [HttpPost]
        public async Task<IActionResult> LookupItemCollection([FromBody]IEnumerable<LookupItemCollection> lookupItemCollections)
        {
            try
            {
                var lookupItemCollectionsFromDb = await _medicoContext.Set<LookupItemCollection>()
                    .ToListAsync();
                foreach (var lookupItemCollection in lookupItemCollections)
                {
                    var lookupItemCollectionId = lookupItemCollection.Id;
                    var lookupItemCollectionFromDb = lookupItemCollectionsFromDb
                        .FirstOrDefault(i => i.Id == lookupItemCollectionId);

                    if (lookupItemCollectionFromDb == null)
                    {
                        _medicoContext.Set<LookupItemCollection>().Add(lookupItemCollection);
                    }
                    else
                    {
                        lookupItemCollectionFromDb.IsDelete = lookupItemCollection.IsDelete;
                        lookupItemCollectionFromDb.Name = lookupItemCollection.Name;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region vital signs

        [Route("vitalsigns")]
        [HttpPost]
        public async Task<IActionResult> VitalSigns([FromBody]IEnumerable<VitalSigns> vitalSigns)
        {
            try
            {
                var vitalSignsFromDb = await _medicoContext.Set<VitalSigns>()
                    .ToListAsync();
                foreach (var vitalSign in vitalSigns)
                {
                    var vitalSignId = vitalSign.Id;
                    var vitalSignFromDb = vitalSignsFromDb
                        .FirstOrDefault(i => i.Id == vitalSignId);

                    if (vitalSignFromDb == null)
                    {
                        _medicoContext.Set<VitalSigns>().Add(vitalSign);
                    }
                    else
                    {
                        vitalSignFromDb.IsDelete = vitalSign.IsDelete;
                        vitalSignFromDb.AdmissionId = vitalSign.AdmissionId;
                        vitalSignFromDb.Pulse = vitalSign.Pulse;
                        vitalSignFromDb.SystolicBloodPressure = vitalSign.SystolicBloodPressure;
                        vitalSignFromDb.OxygenSaturationAtRest = vitalSign.OxygenSaturationAtRest;
                        vitalSignFromDb.OxygenSaturationAtRestValue = vitalSign.OxygenSaturationAtRestValue;
                        vitalSignFromDb.DiastolicBloodPressure = vitalSign.DiastolicBloodPressure;
                        vitalSignFromDb.RespirationRate = vitalSign.RespirationRate;
                        vitalSignFromDb.BloodPressurePosition = vitalSign.BloodPressurePosition;
                        vitalSignFromDb.BloodPressureLocation = vitalSign.BloodPressureLocation;
                        vitalSignFromDb.CreateDate = vitalSign.CreateDate;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region base vital signs

        [Route("basevitalsigns")]
        [HttpPost]
        public async Task<IActionResult> BaseVitalSigns([FromBody]IEnumerable<BaseVitalSigns> baseVitalSigns)
        {
            try
            {
                var baseVitalSignsFromDb = await _medicoContext.Set<BaseVitalSigns>()
                    .ToListAsync();
                foreach (var vitalSign in baseVitalSigns)
                {
                    var vitalSignId = vitalSign.Id;
                    var vitalSignFromDb = baseVitalSignsFromDb
                        .FirstOrDefault(i => i.Id == vitalSignId);

                    if (vitalSignFromDb == null)
                    {
                        _medicoContext.Set<BaseVitalSigns>().Add(vitalSign);
                    }
                    else
                    {
                        vitalSignFromDb.IsDelete = vitalSign.IsDelete;
                        vitalSignFromDb.DominantHand = vitalSign.DominantHand;
                        vitalSignFromDb.Height = vitalSign.Height;
                        vitalSignFromDb.Weight = vitalSign.Weight;
                        vitalSignFromDb.LeftBicep = vitalSign.LeftBicep;
                        vitalSignFromDb.LeftCalf = vitalSign.LeftCalf;
                        vitalSignFromDb.LeftForearm = vitalSign.LeftForearm;
                        vitalSignFromDb.LeftThigh = vitalSign.LeftThigh;
                        vitalSignFromDb.RightBicep = vitalSign.RightBicep;
                        vitalSignFromDb.RightCalf = vitalSign.RightCalf;
                        vitalSignFromDb.RightForearm = vitalSign.RightForearm;
                        vitalSignFromDb.RightThigh = vitalSign.RightThigh;
                        vitalSignFromDb.PatientId = vitalSign.PatientId;
                        vitalSignFromDb.OxygenUse = vitalSign.OxygenUse;
                        vitalSignFromDb.OxygenAmount = vitalSign.OxygenAmount;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion

        #region addendum

        [Route("addendum")]
        [HttpPost]
        public async Task<IActionResult> Addendum([FromBody]IEnumerable<Addendum> addendums)
        {
            try
            {
                var addendumsFromDb = await _medicoContext.Set<Addendum>()
                    .ToListAsync();
                foreach (var addendum in addendums)
                {
                    var addendumId = addendum.Id;
                    var addendumFromDb = addendumsFromDb
                        .FirstOrDefault(i => i.Id == addendumId);

                    if (addendumFromDb == null)
                    {
                        _medicoContext.Set<Addendum>()
                            .Add(addendum);
                    }
                    else
                    {
                        addendumFromDb.Description = addendum.Description;
                        addendumFromDb.CreatedDate = addendum.CreatedDate;
                        addendumFromDb.AdmissionId = addendum.AdmissionId;
                    }
                }
                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }
            return Ok(true);
        }

        #endregion
    }
}