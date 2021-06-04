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
    [Route("api/selectable-lists")]
    public class SelectableListController : ApiController
    {
        private readonly ISelectableListService _selectableListService;

        public SelectableListController(ISelectableListService selectableListService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _selectableListService = selectableListService;
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]SelectableListVm selectableListViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = selectableListViewModel.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

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

            if (!selectableList.CompanyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(selectableList.CompanyId.Value))
                return Unauthorized();

            return Ok(selectableList);
        }

        public async Task<IActionResult> Get(SelectableListSearchFilterVm filter)
        {
            var companyId = filter.CompanyId;

            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(await _selectableListService.GetByFilter(filter));
        }

        [Route("{id}/version")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<VersionPatchVm> listPatch)
        {
            var selectableList = await _selectableListService
                .GetById(id);

            if (selectableList == null)
                return Ok();

            var companyId = selectableList.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            var selectableListPatchVm = new VersionPatchVm();
            listPatch.ApplyTo(selectableListPatchVm);

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _selectableListService.SyncWithLibraryList(id);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("imported-lists")]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<SelectableListPatchVm> selectableListsPatch)
        {
            var importedLists = new SelectableListPatchVm();
            selectableListsPatch.ApplyTo(importedLists);

            await _selectableListService.ImportFromLibrary(importedLists.LibraryEntityIds,
                importedLists.CompanyId, true);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<SelectableListVm> templatePatch)
        {
            var selectableList = await _selectableListService.GetById(id);
            if (selectableList == null)
                return Ok();

            var companyId = selectableList.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var selectableListVm = new SelectableListVm();
            templatePatch.ApplyTo(selectableListVm);

            await _selectableListService.ActivateDeactivateSelectableList(id, selectableListVm.IsActive);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var selectableList = await _selectableListService
                .GetById(id);

            if (selectableList == null)
                return Ok();

            var companyId = selectableList.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _selectableListService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _selectableListService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _selectableListService.Lookup(loadOptions);

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