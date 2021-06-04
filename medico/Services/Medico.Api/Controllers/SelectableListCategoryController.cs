using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableListCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/selectable-list-categories")]
    public class SelectableListCategoryController : ApiController
    {
        private readonly ISelectableListCategoryService _selectableListCategoryService;

        public SelectableListCategoryController(
            ISelectableListCategoryService selectableListCategoryService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _selectableListCategoryService = selectableListCategoryService;
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<SelectableListCategoryVm> categoryPatch)
        {
            var templateType = await _selectableListCategoryService.GetById(id);
            if (templateType == null)
                return Ok();

            var companyId = templateType.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var categoryViewModel = new SelectableListCategoryVm();
            categoryPatch.ApplyTo(categoryViewModel);

            await _selectableListCategoryService.ActivateDeactivateCategory(id, categoryViewModel.IsActive);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post(
            [FromBody]SelectableListCategoryVm selectableListCategoryVm)
        {
            var companyId = selectableListCategoryVm.CompanyId;

            if (!ModelState.IsValid || !companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var createUpdateTask = selectableListCategoryVm.Id == Guid.Empty
                ? _selectableListCategoryService.Create(selectableListCategoryVm)
                : _selectableListCategoryService.Update(selectableListCategoryVm);

            await createUpdateTask;

            return Ok();
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var selectableListCategory = await _selectableListCategoryService.GetById(id);
            if (selectableListCategory == null)
                return NotFound();

            return Ok(selectableListCategory);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
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

            var companyId = selectableListCategory.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _selectableListCategoryService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _selectableListCategoryService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _selectableListCategoryService.Lookup(loadOptions);

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
