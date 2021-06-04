using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/phrase")]
    public class PhraseController : ApiController
    {
        private readonly IPhraseService _phraseServiceService;

        public PhraseController(IPhraseService phraseService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _phraseServiceService = phraseService;
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]PhraseViewModel phraseViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = phraseViewModel.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var createUpdateTask = phraseViewModel.Id == Guid.Empty
                ? _phraseServiceService.Create(phraseViewModel)
                : _phraseServiceService.Update(phraseViewModel);

            var savedUpdatedPhrase = await createUpdateTask;

            return Ok(savedUpdatedPhrase);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var phrase = await _phraseServiceService.GetById(id);
            if (phrase == null)
                return Ok();

            if (!await CompanySecurityService.UserHaveAccessToCompany(phrase.CompanyId))
                return Unauthorized();

            return Ok(phrase);
        }

        [Route("name/{name}/company/{companyId}")]
        public async Task<IActionResult> Get(string name, Guid companyId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var phrase = await _phraseServiceService
                .GetByName(name, companyId);

            return Ok(phrase);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var phrase = await _phraseServiceService.GetById(id);
            if (phrase == null)
                return Ok();

            var companyId = phrase.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            await _phraseServiceService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _phraseServiceService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _phraseServiceService.Lookup(loadOptions);

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
