using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Medico.Api.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.Controllers
{
    [Route("api/icdcodekeyword")]
    public class IcdCodeKeywordController : Controller
    {
        private readonly MedicoContext _medicoContext;

        public IcdCodeKeywordController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        [Route("{skipCount}/{takeCount}")]
        public async Task<IActionResult> Get(int skipCount, int takeCount)
        {
            var icdCodeKeywordsQuery = _medicoContext.Query<IcdCodeKeywordsView>()
                .OrderBy(ick => ick.IcdCodeName)
                .AsQueryable();

            if (skipCount != 0)
                icdCodeKeywordsQuery = icdCodeKeywordsQuery.Skip(skipCount);

            if (takeCount != 0)
                icdCodeKeywordsQuery = icdCodeKeywordsQuery.Take(takeCount);

            var icdCodeKeywordsList = await icdCodeKeywordsQuery.ToListAsync();

            var icdCodeKeywordsCount = await _medicoContext.Query<IcdCodeKeywordsView>()
                .CountAsync();

            var devExtremeGridResult = new DevExtremeGridResultDto<IcdCodeKeywordsView>
            {
                Data = icdCodeKeywordsList,
                TotalCount = icdCodeKeywordsCount
            };

            return Ok(devExtremeGridResult);
        }

        [Route("{icdCodeId}")]
        public async Task<IActionResult> Get(Guid icdCodeId)
        {
            var icdCodeKeywords = await _medicoContext.Query<IcdCodeKeywordsView>()
                .FirstOrDefaultAsync(c => c.IcdCodeId == icdCodeId);

            if (icdCodeKeywords == null)
                return NotFound();

            return Ok(icdCodeKeywords);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]IcdCodeKeywordDto icdCodeKeyword)
        {
            var keywordValue = icdCodeKeyword.KeywordValue;
            var existedKeyword = await _medicoContext.Set<Keyword>()
                .FirstOrDefaultAsync(k => k.Value == keywordValue);

            var keyword = existedKeyword ?? new Keyword { Value = keywordValue };

            var newIcdCodeKeyword = new KeywordIcdCode
            {
                IcdCodeId = icdCodeKeyword.IcdCodeId,
                Keyword = keyword
            };

            _medicoContext.Add(newIcdCodeKeyword);
            await _medicoContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        [Route("{keywordId}/{icdCodeId}")]
        public async Task<IActionResult> Get(Guid keywordId, Guid icdCodeId)
        {
            var icdCodeKeywords = await _medicoContext.Set<KeywordIcdCode>()
                .FirstOrDefaultAsync(c => c.IcdCodeId == icdCodeId && c.KeywordId == keywordId);

            if (icdCodeKeywords == null)
                return Ok();

            _medicoContext.Set<KeywordIcdCode>().Remove(icdCodeKeywords);

            await _medicoContext.SaveChangesAsync();

            return Ok(icdCodeKeywords);
        }
    }
}