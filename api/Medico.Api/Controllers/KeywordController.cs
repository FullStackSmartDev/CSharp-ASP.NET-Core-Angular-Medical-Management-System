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
    [Route("api/keyword")]
    public class KeywordController : Controller
    {
        private readonly MedicoContext _context;

        public KeywordController(MedicoContext medicoContext)
        {
            _context = medicoContext;
        }

        [Route("icd/{icdCodeId}")]
        public async Task<IActionResult> Get(Guid icdCodeId)
        {
            var keywordsByIcdCode = await _context.Set<KeywordIcdCode>()
                .Include(ki => ki.Keyword)
                .Where(ki => ki.IcdCodeId == icdCodeId)
                .Select(ki => ki.Keyword)
                .OrderBy(ki => ki.Value)
                .ToListAsync();

            return Ok(keywordsByIcdCode);
        }

        public async Task<IActionResult> Post([FromBody] IcdCodeKeywordDto icdCodeKeywordDto)
        {
            var keywordValue = icdCodeKeywordDto.KeywordValue;

            var icdCodes = await _context.Set<IcdCode>()
                .Where(c => c.Name.IndexOf(keywordValue, StringComparison.OrdinalIgnoreCase) != -1)
                .ToListAsync();

            var icdCodesMappedToKeyword = await _context.Set<KeywordIcdCode>()
                .Where(kic => kic.Keyword.Value.IndexOf(keywordValue, StringComparison.OrdinalIgnoreCase) != -1)
                .ToListAsync();

            var executeUpdate = false;

            var existedKeyword = await _context.Set<Keyword>()
                .FirstOrDefaultAsync(k => k.Value.IndexOf(keywordValue, StringComparison.OrdinalIgnoreCase) != -1);

            var keyword = existedKeyword ?? new Keyword { Value = keywordValue };

            foreach (var icdCode in icdCodes)
            {
                var icdCodeId = icdCode.Id;
                var codeMappedToKeyword = icdCodesMappedToKeyword
                    .FirstOrDefault(kic => kic.IcdCodeId == icdCodeId);

                if (codeMappedToKeyword != null)
                    continue;

                var newIcdCodeToKeywordMap = new KeywordIcdCode
                {
                    IcdCodeId = icdCodeId,
                    Keyword = keyword
                };
                _context.Add(newIcdCodeToKeywordMap);
                executeUpdate = true;
            }

            if (executeUpdate)
            {
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
