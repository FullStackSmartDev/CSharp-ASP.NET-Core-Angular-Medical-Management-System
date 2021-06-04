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
    [Authorize]
    [Route("api/template-types")]
    public class TemplateTypeController : ApiController
    {
        private readonly ITemplateTypeService _templateTypeService;

        public TemplateTypeController(
            ITemplateTypeService templateTypeService, 
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _templateTypeService = templateTypeService;
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post(
            [FromBody]TemplateTypeVm templateTypeViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = templateTypeViewModel.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            var createUpdateTask = templateTypeViewModel.Id == Guid.Empty
                ? _templateTypeService.Create(templateTypeViewModel)
                : _templateTypeService.Update(templateTypeViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var templateType = await _templateTypeService.GetById(id);
            if (templateType == null)
                return Ok();

            var companyId = templateType.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            return Ok(templateType);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody]JsonPatchDocument<TemplateTypeVm> templatePatch)
        {
            var templateType = await _templateTypeService.GetById(id);
            if (templateType == null)
                return Ok();

            var companyId = templateType.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

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

        [Authorize]
        public async Task<IActionResult> Get(TemplateTypeSearchFilterVm templateTypeSearchFilter)
        {
            return Ok(await _templateTypeService
                .GetByFilter(templateTypeSearchFilter));
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var templateType = await _templateTypeService.GetById(id);
            if (templateType == null)
                return Ok();

            var companyId = templateType.CompanyId;
            if (!companyId.HasValue)
                return BadRequest();

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId.Value))
                return Unauthorized();

            await _templateTypeService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _templateTypeService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _templateTypeService.Lookup(loadOptions);

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
