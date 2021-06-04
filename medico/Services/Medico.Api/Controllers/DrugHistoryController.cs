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
    [Route("api/drughistory")]
    public class DrugHistoryController : ApiController
    {
        private readonly IDrugHistoryService _drugHistoryService;

        public DrugHistoryController(IDrugHistoryService drugHistoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _drugHistoryService = drugHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var drugHistory = await _drugHistoryService.GetById(id);
            if (drugHistory == null)
                return Ok();

            var patientId = drugHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(drugHistory);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientTobaccoHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _drugHistoryService.GetAllByPatientId(patientId));
        }

        [Route("last/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientDrugHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return  Ok(await _drugHistoryService.GetLastCreatedByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]DrugHistoryViewModel drugHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = drugHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = drugHistoryViewModel.Id == Guid.Empty
                ? _drugHistoryService.Create(drugHistoryViewModel)
                : _drugHistoryService.Update(drugHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_drugHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var drugHistory = await _drugHistoryService.GetById(id);
            if (drugHistory == null)
                return Ok();

            var patientId = drugHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _drugHistoryService.Delete(id);
            return Ok();
        }
    }
}
