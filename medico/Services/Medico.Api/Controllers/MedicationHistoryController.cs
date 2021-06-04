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
    [Route("api/medicationhistory")]
    public class MedicationHistoryController : ApiController
    {
        private readonly IMedicationHistoryService _medicationHistoryService;

        public MedicationHistoryController(IMedicationHistoryService medicationHistoryService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _medicationHistoryService = medicationHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var medicationHistory = await _medicationHistoryService.GetById(id);
            if (medicationHistory == null)
                return Ok();

            var patientId = medicationHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(medicationHistory);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientMedications(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicationHistoryService.GetAllByPatientId(patientId));
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientMedicationHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _medicationHistoryService.IsHistoryExist(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MedicationHistoryViewModel medicationHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = medicationHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = medicationHistoryViewModel.Id == Guid.Empty
                ? _medicationHistoryService.Create(medicationHistoryViewModel)
                : _medicationHistoryService.Update(medicationHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_medicationHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var medicationHistory = await _medicationHistoryService.GetById(id);
            if (medicationHistory == null)
                return Ok();

            var patientId = medicationHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _medicationHistoryService.Delete(id);
            return Ok();
        }
    }
}