using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/educationhistory")]
    public class EducationHistoryController : ApiController
    {
        private readonly IEducationHistoryService _educationHistoryService;

        public EducationHistoryController(IEducationHistoryService educationHistoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _educationHistoryService = educationHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var educationHistory = await _educationHistoryService.GetById(id);
            if (educationHistory == null)
                return Ok();

            var patientId = educationHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(educationHistory);
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientEducationHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _educationHistoryService.IsHistoryExist(patientId));
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientEducationHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _educationHistoryService.GetAllByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]EducationHistoryViewModel educationHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = educationHistoryViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = educationHistoryViewModel.Id == Guid.Empty
                ? _educationHistoryService.Create(educationHistoryViewModel)
                : _educationHistoryService.Update(educationHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_educationHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var educationHistory = await _educationHistoryService.GetById(id);
            if (educationHistory == null)
                return Ok();

            var patientId = educationHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _educationHistoryService.Delete(id);
            return Ok();
        }
    }
}