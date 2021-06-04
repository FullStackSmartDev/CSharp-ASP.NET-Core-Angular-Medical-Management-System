using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChart;
using Medico.Application.ViewModels.PatientChartDocument;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/patient-charts")]
    public class PatientChartController : ApiController
    {
        private readonly IPatientChartService _patientChartService;

        public PatientChartController(ICompanySecurityService companySecurityService,
            IPatientChartService patientChartService)
            : base(companySecurityService)
        {
            _patientChartService = patientChartService;
        }

        [Authorize]
        public async Task<IActionResult> Get(PatientChartDocumentFilterVm searchFilterVm)
        {
            return Ok(await _patientChartService.GetByFilter(searchFilterVm));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> Post([FromBody]PatientChartVm patientChartVm)
        {
            var companyId = patientChartVm.CompanyId;
            if (companyId == null)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(await _patientChartService
                .Update(patientChartVm));
        }
    }
}
