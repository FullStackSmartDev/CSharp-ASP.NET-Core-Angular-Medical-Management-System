using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/chiefcomplaintkeyword")]
    public class ChiefComplaintKeywordController : ApiController
    {
        private readonly IChiefComplaintKeywordService _chiefComplaintKeywordService;

        public ChiefComplaintKeywordController(IChiefComplaintKeywordService chiefComplaintKeywordService,
            ICompanySecurityService companySecurityService)
            :base(companySecurityService)
        {
            _chiefComplaintKeywordService = chiefComplaintKeywordService;
        }

        [HttpGet]
        [Route("company/{companyId}/keywords")]
        public async Task<IActionResult> GetByKeywords(IEnumerable<string> keywords,
            Guid companyId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(await _chiefComplaintKeywordService
                .GetByKeywords(keywords, companyId));
        }

        [HttpGet]
        [Route("{value}")]
        public async Task<IActionResult> Get(string value)
        {
            var keyword = await _chiefComplaintKeywordService.GetByValue(value);
            if (keyword == null)
                return NotFound();

            return Ok(keyword);
        }

        [HttpGet]
        [Route("icdcode/{icdCodeId}/keyword/{keyword}/existence")]
        public Task<bool> Get(Guid icdCodeId, string keyword)
        {
            return _chiefComplaintKeywordService.CheckMappingExistence(icdCodeId, keyword);
        }

        [HttpGet]
        [Route("icdcode/{icdCodeId}")]
        public Task<IEnumerable<ChiefComplaintKeywordViewModel>> Get(Guid icdCodeId)
        {
            return _chiefComplaintKeywordService.GetByIcdCodeId(icdCodeId);
        }

        [HttpPost]
        [Route("icdcode/mapping")]
        public Task PostIcdCodeMapping([FromBody] MappingIcdCodeChiefComplaintKeywordViewModel mappingIcdCodeChiefComplaintKeywordViewModel)
        {
            return _chiefComplaintKeywordService.CreateIcdCodeMapping(mappingIcdCodeChiefComplaintKeywordViewModel);
        }

        [HttpDelete]
        [Route("{keywordId}/icdcode/{icdCodeId}")]
        public Task IcdCodeMapping(Guid keywordId, Guid icdCodeId)
        {
            return _chiefComplaintKeywordService.DeleteIcdCodeMapping(keywordId, icdCodeId);
        }

        [HttpDelete]
        [Route("keyword/{keyword}/icdcode/{icdCodeId}")]
        public Task IcdCodeMapping(string keyword, Guid icdCodeId)
        {
            return _chiefComplaintKeywordService.DeleteIcdCodeMapping(keyword, icdCodeId);
        }
    }
}
