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
    [Route("api/medicalhistory")]
    public class MedicalHistoryController : ApiController
    {
        private readonly IMedicalHistoryService _medicalHistoryService;

        public MedicalHistoryController(IMedicalHistoryService medicalHistoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _medicalHistoryService = medicalHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var medicalHistory = await _medicalHistoryService.GetById(id);
            if (medicalHistory == null)
                return Ok();

            var patientId = medicalHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(medicalHistory);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientMedicalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicalHistoryService.GetAllByPatientId(patientId));
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientMedicalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicalHistoryService.IsHistoryExist(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MedicalHistoryViewModel medicalHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = medicalHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = medicalHistoryViewModel.Id == Guid.Empty
                ? _medicalHistoryService.Create(medicalHistoryViewModel)
                : _medicalHistoryService.Update(medicalHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_medicalHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var medicalHistory = await _medicalHistoryService.GetById(id);
            if (medicalHistory == null)
                return Ok();

            var patientId = medicalHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _medicalHistoryService.Delete(id);
            return Ok();
        }
    }
}
