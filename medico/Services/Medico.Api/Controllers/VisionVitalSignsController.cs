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
    [Route("api/visionvitalsigns")]
    public class VisionVitalSignsController : ApiController
    {
        private readonly IVisionVitalSignsService _visionVitalSignsService;

        public VisionVitalSignsController(IVisionVitalSignsService visionVitalSignsService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _visionVitalSignsService = visionVitalSignsService;
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _visionVitalSignsService.GetByPatientId(patientId));
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var vitalSigns = await _visionVitalSignsService.GetById(id);
            if (vitalSigns == null)
                return Ok();

            var patientId = vitalSigns.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(vitalSigns);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]VisionVitalSignsViewModel visionVitalSignsViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId =
                visionVitalSignsViewModel.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = visionVitalSignsViewModel.Id == Guid.Empty
                ? _visionVitalSignsService.Create(visionVitalSignsViewModel)
                : _visionVitalSignsService.Update(visionVitalSignsViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            historyDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            historyDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_visionVitalSignsService.GetAll(historyDxOptionsViewModel),
                historyDxOptionsViewModel);
        }
    }
}
