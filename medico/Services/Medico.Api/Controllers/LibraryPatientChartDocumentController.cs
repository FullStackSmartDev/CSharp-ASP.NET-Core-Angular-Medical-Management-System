using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChartDocument;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-patient-chart-documents")]
    public class LibraryPatientChartDocumentController : ControllerBase
    {
        private readonly IPatientChartDocumentNodeService _patientChartDocumentNodeService;

        public LibraryPatientChartDocumentController(IPatientChartDocumentNodeService patientChartDocumentNodeService)
        {
            _patientChartDocumentNodeService = patientChartDocumentNodeService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(PatientChartDocumentSearchVm searchFilterVm)
        {
            return Ok(await _patientChartDocumentNodeService.GetByFilter(searchFilterVm));
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}/copy")]
        public async Task<IActionResult> GetPatientChartDocumentCopy(Guid id)
        {
            var patientChartDocument = await _patientChartDocumentNodeService
                .GetById(id);

            return Ok(_patientChartDocumentNodeService
                .GetPatientChartDocumentCopy(patientChartDocument));
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _patientChartDocumentNodeService
                .LibraryLookup(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}
