using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels.TemplateHistory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/template-history")]
    public class TemplateHistoryController : ApiController
    {
        private readonly IAdmissionService _admissionService;
        private readonly ITemplateHistoryService _templateHistoryService;

        public TemplateHistoryController(ICompanySecurityService companySecurityService,
            IAdmissionService admissionService,
            ITemplateHistoryService templateHistoryService)
            : base(companySecurityService)
        {
            _admissionService = admissionService;
            _templateHistoryService = templateHistoryService;
        }
        
        public async Task<IActionResult> Get(TemplateHistorySearchFilterVm searchFilter)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var admissionId = searchFilter.AdmissionId;
            
            var admission = await _admissionService
                .GetById(admissionId);

            if (admission == null)
                return NotFound();

            var patientId = admission.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _templateHistoryService
                .GetPreviousDetailedTemplateContent(admissionId, searchFilter.TemplateId, admission.PatientId));
        }
    }
}