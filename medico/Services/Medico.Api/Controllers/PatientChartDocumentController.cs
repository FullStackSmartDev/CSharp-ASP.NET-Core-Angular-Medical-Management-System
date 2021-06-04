using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChartDocument;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/patient-chart-documents")]
    public class PatientChartDocumentController : ApiController
    {
        private readonly IPatientChartDocumentNodeService _patientChartDocumentNodeService;

        public PatientChartDocumentController(ICompanySecurityService companySecurityService,
            IPatientChartDocumentNodeService patientChartDocumentNodeService)
            : base(companySecurityService)
        {
            _patientChartDocumentNodeService = patientChartDocumentNodeService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] PatientChartDocumentSearchVm searchFilterVm)
        {
            return Ok(await _patientChartDocumentNodeService.GetByFilter(searchFilterVm));
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var patientChartDocument = await _patientChartDocumentNodeService
                .GetWithVersionById(id);

            var company = patientChartDocument.CompanyId;
            if (!company.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(company.Value))
                return Unauthorized();

            return Ok(patientChartDocument);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("imported-documents")]
        public async Task<IActionResult> Patch(
            [FromBody] JsonPatchDocument<PatientChartDocumentsImportVm> documentsImportPatchVm)
        {
            var importedDocumentsPatch = new PatientChartDocumentsImportVm();
            documentsImportPatchVm.ApplyTo(importedDocumentsPatch);

            var importedDocuments = await _patientChartDocumentNodeService
                .ImportFromLibrary(importedDocumentsPatch);

            return Ok(importedDocuments);
        }

        [Route("{id}/version")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch(Guid id,
            [FromBody] JsonPatchDocument<PatientChartDocumentVersionPatchVm> libraryPatch)
        {
            var patientChartDocument =
                await _patientChartDocumentNodeService.GetWithVersionById(id);

            if (patientChartDocument == null)
                return Ok();

            var companyId = patientChartDocument.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var templatePatchVm = new PatientChartDocumentVersionPatchVm();
            libraryPatch.ApplyTo(templatePatchVm);

            await _patientChartDocumentNodeService.SyncWithLibrary(id, templatePatchVm.PatientChartRootNodeId);

            return Ok();
        }

        [HttpGet]
        [Route("{id}/copy")]
        public async Task<IActionResult> GetPatientChartDocumentCopy(Guid id)
        {
            var patientChartDocument = await _patientChartDocumentNodeService
                .GetById(id);

            var companyId = patientChartDocument.CompanyId;

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(_patientChartDocumentNodeService.GetPatientChartDocumentCopy(patientChartDocument));
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _patientChartDocumentNodeService
                .Lookup(loadOptions);

            loadOptions.PrimaryKey = new[] {"Id"};
            loadOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}