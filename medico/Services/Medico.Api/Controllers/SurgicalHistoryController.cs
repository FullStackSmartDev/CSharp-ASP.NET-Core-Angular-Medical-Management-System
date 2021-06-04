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
    [Route("api/surgicalhistory")]
    public class SurgicalHistoryController : ApiController
    {
        private readonly ISurgicalHistoryService _surgicalHistoryService;

        public SurgicalHistoryController(ISurgicalHistoryService surgicalHistoryService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _surgicalHistoryService = surgicalHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var surgicalHistory = await _surgicalHistoryService.GetById(id);
            if (surgicalHistory == null)
                return Ok();

            var patientId = surgicalHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(surgicalHistory);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientSurgicalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();
            return Ok(await _surgicalHistoryService.GetAllByPatientId(patientId));
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientSurgicalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();
            return Ok( await _surgicalHistoryService.IsHistoryExist(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]SurgicalHistoryViewModel surgicalHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = surgicalHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = surgicalHistoryViewModel.Id == Guid.Empty
                ? _surgicalHistoryService.Create(surgicalHistoryViewModel)
                : _surgicalHistoryService.Update(surgicalHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_surgicalHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var surgicalHistory = await _surgicalHistoryService.GetById(id);
            if (surgicalHistory == null)
                return Ok();

            var patientId = surgicalHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _surgicalHistoryService.Delete(id);
            return Ok();
        }
    }
}