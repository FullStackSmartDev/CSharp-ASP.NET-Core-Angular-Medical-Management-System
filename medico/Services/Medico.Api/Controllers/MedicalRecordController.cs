using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/medicalrecord")]
    public class MedicalRecordController : ApiController
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordController(IMedicalRecordService medicalRecordService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _medicalRecordService = medicalRecordService;
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientMedicalRecords(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicalRecordService.GetAllByPatientId(patientId));
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var medicalRecord = await _medicalRecordService.GetById(id);
            if (medicalRecord == null)
                return Ok();

            var patientId = medicalRecord.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(medicalRecord);
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientMedicalRecord(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicalRecordService.IsHistoryExist(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MedicalRecordViewModel medicalRecordViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = medicalRecordViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = medicalRecordViewModel.Id == Guid.Empty
                ? _medicalRecordService.Create(medicalRecordViewModel)
                : _medicalRecordService.Update(medicalRecordViewModel);

            medicalRecordViewModel = await createUpdateTask;

            return Ok(medicalRecordViewModel);
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_medicalRecordService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var medicalRecord = await _medicalRecordService.GetById(id);
            if (medicalRecord == null)
                return Ok();

            var patientId = medicalRecord.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _medicalRecordService.Delete(id);
            return Ok();
        }
    }
}