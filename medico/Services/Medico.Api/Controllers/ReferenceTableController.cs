using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.ReferenceTable;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/reference-tables")]
    public class ReferenceTableController : ApiController
    {
        private readonly IReferenceTableService _referenceTableService;

        public ReferenceTableController(IReferenceTableService referenceTableService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _referenceTableService = referenceTableService;
        }
        
        [Route("{id}/version")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<VersionPatchVm> listPatch)
        {
            var referenceTable = await _referenceTableService
                .GetById(id);

            if (referenceTable == null)
                return Ok();

            var companyId = referenceTable.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            var selectableListPatchVm = new VersionPatchVm();
            listPatch.ApplyTo(selectableListPatchVm);

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _referenceTableService.SyncWithLibraryReferenceTable(id);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("imported-tables")]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<EntitiesImportPatchVm> referenceTablesPatch)
        {
            var importedReferenceTables = new EntitiesImportPatchVm();
            referenceTablesPatch.ApplyTo(importedReferenceTables);

            await _referenceTableService.ImportFromLibrary(importedReferenceTables.LibraryEntityIds,
                importedReferenceTables.CompanyId, true);

            return Ok();
        }
        
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ReferenceTableVm referenceTable)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = referenceTable.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(await _referenceTableService.Update(referenceTable));
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var referenceTable =
                await _referenceTableService.GetById(id);

            if (referenceTable == null)
                return Ok();

            var companyId = referenceTable.CompanyId;
            if (companyId == null)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(referenceTable);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _referenceTableService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] {"Id"};
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _referenceTableService.Lookup(loadOptions);

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