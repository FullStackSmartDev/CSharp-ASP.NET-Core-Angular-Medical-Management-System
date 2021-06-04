using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/allegationsnotesstatus")]
    public class AllegationsNotesStatusController : ApiController
    {
        private readonly IAllegationsNotesStatusService _allegationsNotesStatusService;

        public AllegationsNotesStatusController(IAllegationsNotesStatusService allegationsNotesStatusService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _allegationsNotesStatusService = allegationsNotesStatusService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AllegationsNotesStatusViewModel allegationsNotesStatusViewModel)
        {
            var admissionId = allegationsNotesStatusViewModel.AdmissionId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            var allegationsNotesStatus = await _allegationsNotesStatusService
                .Create(allegationsNotesStatusViewModel);

            return Ok(allegationsNotesStatus);
        }

        [HttpGet]
        [Route("admission/{admissionId}")]
        public async Task<IActionResult> Get(Guid admissionId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            var allegationsNotesStatus = await _allegationsNotesStatusService
                .GetByAdmissionId(admissionId);

            return Ok(allegationsNotesStatus);
        }
    }
}
