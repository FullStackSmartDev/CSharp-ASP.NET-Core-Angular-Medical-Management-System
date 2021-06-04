using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.ReferenceTable;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/library-reference-tables")]
    public class LibraryReferenceTableController : ControllerBase
    {
        private readonly IReferenceTableService _referenceTableService;

        public LibraryReferenceTableController(IReferenceTableService referenceTableService)
        {
            _referenceTableService = referenceTableService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var referenceTable =
                await _referenceTableService.GetById(id);

            if (referenceTable == null)
                return Ok();

            return Ok(referenceTable);
        }

        public async Task<IActionResult> Get(ImportedItemsSearchFilterVm filter)
        {
            return Ok(await _referenceTableService
                .GetByFilter(filter));
        }
        
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ReferenceTableVm referenceTable)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(await _referenceTableService.Update(referenceTable));
        }

        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            var query = _referenceTableService.LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] {"Id"};
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _referenceTableService.LibraryLookup(loadOptions);

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