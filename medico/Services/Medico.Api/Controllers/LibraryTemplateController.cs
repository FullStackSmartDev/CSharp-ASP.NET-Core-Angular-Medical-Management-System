using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/library-templates")]
    public class LibraryTemplateController : ControllerBase
    {
        private readonly ITemplateService _templateService;

        public LibraryTemplateController(ITemplateService templateService)
        {
            _templateService = templateService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var template = await _templateService.GetById(id);
            if (template == null)
                return Ok();

            return Ok(template);
        }

        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Get(TemplateSearchFilterVm templateSearchFilter)
        {
            return Ok(await _templateService.GetByFilter(templateSearchFilter));
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<TemplateVm> templatePatch)
        {
            var templateViewModel = new TemplateVm();
            templatePatch.ApplyTo(templateViewModel);

            if (templateViewModel.IsActive)
            {
                await _templateService.ActivateTemplate(id);
                return Ok();
            }

            await _templateService.DeactivateTemplate(id);

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<TemplatesOrdersVm> templatesPatch)
        {
            var templatesOrders = new TemplatesOrdersVm();
            templatesPatch.ApplyTo(templatesOrders);

            await _templateService.ReorderTemplates(templatesOrders);

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TemplateVm templateViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var createUpdateTask = templateViewModel.Id == Guid.Empty
                ? _templateService.Create(templateViewModel)
                : _templateService.Update(templateViewModel);

            var savedUpdatedTemplate = await createUpdateTask;

            return Ok(savedUpdatedTemplate);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _templateService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(TemplateDxOptionsViewModel loadOptions)
        {
            var query = _templateService.LibraryGrid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;
            loadOptions.Sort = new[]
            {
                new SortingInfo { Desc = true, Selector = "IsActive" },
                new SortingInfo { Desc = false, Selector = "TemplateOrder" }
            };

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _templateService.LibraryLookup(loadOptions);

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
