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
    [Route("api/tobaccohistory")]
    public class TobaccoHistoryController : ApiController
    {
        private readonly ITobaccoHistoryService _tobaccoHistoryService;

        public TobaccoHistoryController(ITobaccoHistoryService tobaccoHistoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _tobaccoHistoryService = tobaccoHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var tobaccoHistory = await _tobaccoHistoryService.GetById(id);
            if (tobaccoHistory == null)
                return Ok();

            var patientId = tobaccoHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(tobaccoHistory);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientTobaccoHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _tobaccoHistoryService.GetAllByPatientId(patientId));
        }

        [Route("last/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientTobaccoHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _tobaccoHistoryService.GetLastCreatedByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TobaccoHistoryViewModel tobaccoHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = tobaccoHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = tobaccoHistoryViewModel.Id == Guid.Empty
                ? _tobaccoHistoryService.Create(tobaccoHistoryViewModel)
                : _tobaccoHistoryService.Update(tobaccoHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_tobaccoHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tobaccoHistory = await _tobaccoHistoryService.GetById(id);
            if (tobaccoHistory == null)
                return Ok();

            var patientId = tobaccoHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _tobaccoHistoryService.Delete(id);
            return Ok();
        }
    }
}
