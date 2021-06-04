using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Expression;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-expressions")]
    [Authorize]
    public class LibraryExpressionsController : ControllerBase
    {
        private readonly IExpressionService _expressionService;

        public LibraryExpressionsController(IExpressionService expressionService)
        {
            _expressionService = expressionService;
        }
        
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]CreateUpdateExpressionVm expression)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var createUpdateTask = expression.Id == Guid.Empty
                ? _expressionService.Create(expression)
                : _expressionService.Update(expression);

            await createUpdateTask;

            return Ok();
        }

        public async Task<IActionResult> Get(ImportedItemsSearchFilterVm filter)
        {
            return Ok(await _expressionService
                .GetByFilter(filter));
        }
        
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var expression =
                await _expressionService.GetById(id);

            if (expression == null)
                return Ok();

            return Ok(expression);
        }
        
        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}/reference-tables")]
        public async Task<IActionResult> GetExpressionReferenceTables(Guid id)
        {
            var referenceTables =
                await _expressionService.GetReferenceTables(id);

            return Ok(referenceTables);
        }
        
        [HttpDelete]
        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var expression = await _expressionService
                .GetById(id);

            if (expression == null)
                return Ok();

            await _expressionService.Delete(id);
            return Ok();
        }
        
        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            var query = _expressionService.LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }
        
        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _expressionService.LibraryLookup(loadOptions);

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