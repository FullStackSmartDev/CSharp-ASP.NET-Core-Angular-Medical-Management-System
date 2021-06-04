using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableList;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/library-selectable-lists")]
    public class LibrarySelectableListController : ControllerBase
    {
        private readonly ISelectableListService _selectableListService;

        public LibrarySelectableListController(ISelectableListService selectableListService)
        {
            _selectableListService = selectableListService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]SelectableListVm selectableListViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var createUpdateTask = selectableListViewModel.Id == Guid.Empty
                ? _selectableListService.Create(selectableListViewModel)
                : _selectableListService.Update(selectableListViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var selectableList =
                await _selectableListService.GetById(id);

            if (selectableList == null)
                return Ok();

            return Ok(selectableList);
        }

        public async Task<IActionResult> Get(SelectableListSearchFilterVm filter)
        {
            return Ok(await _selectableListService.GetByFilter(filter));
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<SelectableListVm> templatePatch)
        {
            var selectableListVm = new SelectableListVm();
            templatePatch.ApplyTo(selectableListVm);

            await _selectableListService.ActivateDeactivateSelectableList(id, selectableListVm.IsActive);

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var selectableList = await _selectableListService
                .GetById(id);

            if (selectableList == null)
                return Ok();

            await _selectableListService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            var query = _selectableListService.LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _selectableListService.LibraryLookup(loadOptions);

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
