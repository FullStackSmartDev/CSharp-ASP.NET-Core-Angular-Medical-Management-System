using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/vitalsignsnotes")]
    public class VitalSignsNotesController : ApiController
    {
        private readonly IVitalSignsNotesService _vitalSignsNotesService;

        public VitalSignsNotesController(IVitalSignsNotesService vitalSignsNotesService,
            ICompanySecurityService companySecurityService): base(companySecurityService)
        {
            _vitalSignsNotesService = vitalSignsNotesService;
        }

        [Route("admission/{admissionId}")]
        public async Task<IActionResult> Get(Guid admissionId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            return Ok(await _vitalSignsNotesService.GetByAdmissionId(admissionId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] VitalSignsNotesViewModel vitalSignsNotesViewModel)
        {
            var admissionId = vitalSignsNotesViewModel.AdmissionId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            var createUpdateTask = vitalSignsNotesViewModel.Id == Guid.Empty
                ? _vitalSignsNotesService.Create(vitalSignsNotesViewModel)
                : _vitalSignsNotesService.Update(vitalSignsNotesViewModel);

            var savedVitalSignsNotes = await createUpdateTask;

            return Ok(savedVitalSignsNotes);
        }
    }
}
