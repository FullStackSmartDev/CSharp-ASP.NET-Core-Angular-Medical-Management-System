using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.TemplateType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-template-types")]
    public class LibraryTemplateTypeController : ControllerBase
    {
        private readonly ITemplateTypeService _templateTypeService;

        public LibraryTemplateTypeController(
            ITemplateTypeService templateTypeService)
        {
            _templateTypeService = templateTypeService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post(
            [FromBody]TemplateTypeVm templateTypeViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var createUpdateTask = templateTypeViewModel.Id == Guid.Empty
                ? _templateTypeService.Create(templateTypeViewModel)
                : _templateTypeService.Update(templateTypeViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var templateType = await _templateTypeService.GetById(id);
            if (templateType == null)
                return Ok();

            return Ok(templateType);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<TemplateTypeVm> templatePatch)
        {
            var templateViewModel = new TemplateTypeVm();
            templatePatch.ApplyTo(templateViewModel);

            if (templateViewModel.IsActive)
            {
                await _templateTypeService.ActivateTemplate(id);
                return Ok();
            }

            await _templateTypeService.DeactivateTemplate(id);

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Get(TemplateTypeSearchFilterVm searchFilter)
        {
            return Ok(await _templateTypeService
                .GetByFilter(searchFilter));
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _templateTypeService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            var query = _templateTypeService.LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _templateTypeService.LibraryLookup(loadOptions);

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