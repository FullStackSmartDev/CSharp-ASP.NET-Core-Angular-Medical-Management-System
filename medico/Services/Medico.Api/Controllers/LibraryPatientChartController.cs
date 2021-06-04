using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChart;
using Medico.Application.ViewModels.PatientChartDocument;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-patient-charts")]
    public class LibraryPatientChartController : ControllerBase
    {
        private readonly IPatientChartService _patientChartService;

        public LibraryPatientChartController(IPatientChartService patientChartService)
        {
            _patientChartService = patientChartService;
        }

        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Get(PatientChartDocumentFilterVm searchFilterVm)
        {
            return Ok(await _patientChartService
                .GetByFilter(searchFilterVm));
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Post([FromBody]PatientChartVm patientChartVm)
        {
            return Ok(await _patientChartService
                .Update(patientChartVm));
        }
    }
}
