using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Expression;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/expressions")]
    public class ExpressionsController : ApiController
    {
        private readonly IExpressionService _expressionService;

        public ExpressionsController(IExpressionService expressionService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _expressionService = expressionService;
        }
        
        [Route("{id}/version")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<VersionPatchVm> listPatch)
        {
            var referenceTable = await _expressionService
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

            await _expressionService.SyncWithLibraryExpression(id);

            return Ok();
        }
        
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("imported-expressions")]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<EntitiesImportPatchVm> referenceTablesPatch)
        {
            var importedExpressions = new EntitiesImportPatchVm();
            referenceTablesPatch.ApplyTo(importedExpressions);

            await _expressionService.ImportFromLibrary(importedExpressions.LibraryEntityIds,
                importedExpressions.CompanyId, true);

            return Ok();
        }
        
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]CreateUpdateExpressionVm expression)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            
            var companyId = expression.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();
            
            var createUpdateTask = expression.Id == Guid.Empty
                ? _expressionService.Create(expression)
                : _expressionService.Update(expression);

            await createUpdateTask;

            return Ok();
        }
        
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var expression =
                await _expressionService.GetById(id);

            if (expression == null)
                return Ok();
            
            var companyId = expression.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(expression);
        }
        
        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("{id}/reference-tables")]
        public async Task<IActionResult> GetExpressionReferenceTables(Guid id)
        {
            var expression =
                await _expressionService.GetById(id);

            if (expression == null)
                return Ok();
            
            var companyId = expression.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();
            
            var referenceTables =
                await _expressionService.GetReferenceTables(id);

            return Ok(referenceTables);
        }
        
        [HttpDelete]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var expression = await _expressionService
                .GetById(id);

            if (expression == null)
                return Ok();
            
            var companyId = expression.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _expressionService.Delete(id);
            return Ok();
        }
        
        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _expressionService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }
        
        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _expressionService.Lookup(loadOptions);

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