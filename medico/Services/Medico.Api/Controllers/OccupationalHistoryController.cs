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
    [Route("api/occupationalhistory")]
    public class OccupationalHistoryController : ApiController
    {
        private readonly IOccupationalHistoryService _occupationalHistoryService;

        public OccupationalHistoryController(IOccupationalHistoryService occupationalHistoryService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _occupationalHistoryService = occupationalHistoryService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var occupationalHistory = await _occupationalHistoryService.GetById(id);
            if (occupationalHistory == null)
                return Ok();

            var patientId = occupationalHistory.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(occupationalHistory);
        }

        [Route("historyexistence/patient/{patientId}")]
        public async Task<IActionResult> GetLastPatientOccupationalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _occupationalHistoryService.IsHistoryExist(patientId));
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetPatientOccupationalHistory(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _occupationalHistoryService.GetAllByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]OccupationalHistoryViewModel occupationalHistoryViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = occupationalHistoryViewModel.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = occupationalHistoryViewModel.Id == Guid.Empty
                ? _occupationalHistoryService.Create(occupationalHistoryViewModel)
                : _occupationalHistoryService.Update(occupationalHistoryViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_occupationalHistoryService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var occupationalHistory = await _occupationalHistoryService.GetById(id);
            if (occupationalHistory == null)
                return Ok();

            var patientId = occupationalHistory.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _occupationalHistoryService.Delete(id);
            return Ok();
        }
    }
}
