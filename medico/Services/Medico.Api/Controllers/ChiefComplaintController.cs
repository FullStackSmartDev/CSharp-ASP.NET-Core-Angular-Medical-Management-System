using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/chiefcomplaint")]
    public class ChiefComplaintController : ApiController
    {
        private readonly IChiefComplaintService _chiefComplaintService;

        public ChiefComplaintController(IChiefComplaintService chiefComplaintService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _chiefComplaintService = chiefComplaintService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ChiefComplaintViewModel chiefComplaintViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = chiefComplaintViewModel.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var createUpdateTask = chiefComplaintViewModel.Id == Guid.Empty
                ? _chiefComplaintService.Create(chiefComplaintViewModel)
                : _chiefComplaintService.Update(chiefComplaintViewModel);

            var chiefComplaint = await createUpdateTask;

            return Ok(chiefComplaint);
        }

        [HttpGet]
        [Route("keywords/company/{companyId}")]
        public async Task<IActionResult> GetChiefComplaintWithKeywords(Guid companyId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(await _chiefComplaintService
                .GetChiefComplaintWithKeywords(companyId));
        }

        [HttpPost]
        [Route("keywords")]
        public Task Post([FromBody]AddKeywordsViewModel addKeywordsViewModel)
        {
            return _chiefComplaintService.AddKeywords(addKeywordsViewModel);
        }

        [HttpGet]
        [Route("{id}/templatetype/{templateTypeId}")]
        public Task<IEnumerable<TemplateVm>> GetChiefComplaintTemplates(Guid id, Guid templateTypeId)
        {
            return _chiefComplaintService
                .GetChiefComplaintTemplatesByType(id, templateTypeId);
        }

        [HttpGet]
        [Route("{id}/keyword")]
        public Task<IEnumerable<ChiefComplaintKeywordViewModel>> GetChiefComplaintKeywords(Guid id)
        {
            return _chiefComplaintService.GetChiefComplaintKeywords(id);
        }

        [HttpPost]
        [Route("{id}/template")]
        public Task Post(Guid id, [FromBody]IEnumerable<Guid> templateIds)
        {
            return _chiefComplaintService.SaveChiefComplaintTemplates(id, templateIds);
        }

        [HttpPost]
        [Route("{id}/keyword")]
        public Task Post(Guid id, [FromBody]IEnumerable<string> keywords)
        {
            return _chiefComplaintService.SaveChiefComplaintKeywords(id, keywords);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var chiefComplaint = await _chiefComplaintService.GetById(id);
            if (chiefComplaint == null)
                return Ok(null);

            var companyId = chiefComplaint.CompanyId;

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(chiefComplaint);
        }

        [Route("name/{name}/company/{companyId}")]
        public async Task<IActionResult> Get(string name, Guid companyId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var chiefComplaint = await _chiefComplaintService
                .GetByName(name, companyId);

            return Ok(chiefComplaint);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var chiefComplaint = await _chiefComplaintService
                .GetById(id);

            var companyId = chiefComplaint.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            await _chiefComplaintService.Delete(id);
            return Ok();
        }

        [Route("dx/grid")]
        public async Task<object> DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var gridQuery =
                await _chiefComplaintService.GetChiefComplaintTemplatesKeywords(loadOptions);

            //provide ability of case-insensitive search
            //consider to use this configuration value globally
            loadOptions.StringToLower = true;

            return DataSourceLoader.Load(gridQuery, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var query = _chiefComplaintService
                .Lookup(loadOptions);

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}
