using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/alcoholhistory")]
    public class AlcoholHistoryController : ApiController
    {
        private readonly IAlcoholHistoryService _alcoholHistoryService;

        public AlcoholHistoryController(IAlcoholHistoryService alcoholHistoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _alcoholHistoryService = alcoholHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var patientAlcoholHistory = await _alcoholHistoryService.GetById(id);
            if (patientAlcoholHistory == null)
                return Ok(null);

            var patientId = patientAlcoholHistory.PatientId;

            if (await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Ok(patientAlcoholHistory);

            return Unauthorized();
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientAlcoholHistory(Guid patientId)
        {
            if (await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Ok(await _alcoholHistoryService.GetAllByPatientId(patientId));

            return Unauthorized();
        }

        [Route("last/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientAlcoholHistory(Guid patientId)
        {
            if (await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Ok(await _alcoholHistoryService.GetLastCreatedByPatientId(patientId));

            return Unauthorized();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AlcoholHistoryViewModel alcoholHistoryViewModel)
        {
            var patientId = alcoholHistoryViewModel.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = alcoholHistoryViewModel.Id == Guid.Empty
                ? _alcoholHistoryService.Create(alcoholHistoryViewModel)
                : _alcoholHistoryService.Update(alcoholHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_alcoholHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var alcoholHistory = await _alcoholHistoryService.GetById(id);
            if (alcoholHistory == null)
                return Ok();

            var patientId = alcoholHistory.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _alcoholHistoryService.Delete(id);
            return Ok();
        }
    }
}
