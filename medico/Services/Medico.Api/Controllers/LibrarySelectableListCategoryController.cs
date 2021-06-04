using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.Services;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableListCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-selectable-list-categories")]
    public class LibrarySelectableListCategoryController : ControllerBase
    {
        private readonly ISelectableListCategoryService _selectableListCategoryService;

        public LibrarySelectableListCategoryController(
            ISelectableListCategoryService selectableListCategoryService)
        {
            _selectableListCategoryService = selectableListCategoryService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<SelectableListCategoryVm> categoryPatch)
        {
            var categoryViewModel = new SelectableListCategoryVm();
            categoryPatch.ApplyTo(categoryViewModel);

            await _selectableListCategoryService
                .ActivateDeactivateCategory(id, categoryViewModel.IsActive);

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post(
            [FromBody]SelectableListCategoryVm selectableListCategoryVm)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var createUpdateTask = selectableListCategoryVm.Id == Guid.Empty
                ? _selectableListCategoryService.Create(selectableListCategoryVm)
                : _selectableListCategoryService.Update(selectableListCategoryVm);

            await createUpdateTask;

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var selectableListCategory = 
                await _selectableListCategoryService.GetById(id);

            if (selectableListCategory == null)
                return NotFound();

            return Ok(selectableListCategory);
        }

        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Get(SearchFilterVm searchFilter)
        {
            return Ok(await _selectableListCategoryService
                .GetByFilter(searchFilter));
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var selectableListCategory = await _selectableListCategoryService
                .GetById(id);

            if (selectableListCategory == null)
                return Ok();

            await _selectableListCategoryService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            var query = _selectableListCategoryService
                .LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _selectableListCategoryService.LibraryLookup(loadOptions);

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
