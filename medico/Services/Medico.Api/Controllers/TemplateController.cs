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
    [Authorize]
    [Route("api/templates")]
    public class TemplateController : ApiController
    {
        private readonly ITemplateService _templateService;

        public TemplateController(ITemplateService templateService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _templateService = templateService;
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TemplateVm templateViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = templateViewModel.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var createUpdateTask = templateViewModel.Id == Guid.Empty
                ? _templateService.Create(templateViewModel)
                : _templateService.Update(templateViewModel);

            var savedUpdatedTemplate = await createUpdateTask;

            return Ok(savedUpdatedTemplate);
        }


        [Authorize]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var template = await _templateService.GetById(id);
            if (template == null)
                return Ok();

            var companyId = template.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(template);
        }

        [Authorize]
        public async Task<IActionResult> Get(TemplateSearchFilterVm templateSearchFilter)
        {
            return Ok(await _templateService.GetByFilter(templateSearchFilter));
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<TemplateVm> templatePatch)
        {
            var template = await _templateService.GetById(id);
            if (template == null)
                return Ok();

            var companyId = template.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

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

        [Route("{id}/version")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<VersionPatchVm> templatePatch)
        {
            var template = await _templateService
                .GetById(id);

            if (template == null)
                return Ok();

            var companyId = template.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            var templatePatchVm = new VersionPatchVm();
            templatePatch.ApplyTo(templatePatchVm);

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _templateService.SyncWithLibraryTemplate(id);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<TemplatesOrdersVm> templatesPatch)
        {
            var templatesOrders = new TemplatesOrdersVm();
            templatesPatch.ApplyTo(templatesOrders);

            await _templateService.ReorderTemplates(templatesOrders);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("imported-templates")]
        public async Task<IActionResult> Patch([FromBody]JsonPatchDocument<TemplatesImportPatchVm> templatesPatch)
        {
            var importedTemplates = new TemplatesImportPatchVm();
            templatesPatch.ApplyTo(importedTemplates);

            await _templateService.ImportFromLibrary(importedTemplates);

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var template = await _templateService.GetById(id);
            if (template == null)
                return Ok();

            var companyId = template.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _templateService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(TemplateDxOptionsViewModel loadOptions)
        {
            var query = _templateService.Grid(loadOptions);

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
        public object DxLookupData(TemplateDxOptionsViewModel loadOptions)
        {
            var query = _templateService.Lookup(loadOptions);

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