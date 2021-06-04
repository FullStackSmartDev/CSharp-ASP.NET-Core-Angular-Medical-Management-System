using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.Controllers
{
    [Route("api/icd")]
    public class IcdCodeController : Controller
    {
        private readonly MedicoContext _context;

        public IcdCodeController(MedicoContext context)
        {
            _context = context;
        }

        [Route("keyword/{keywordValue}")]
        public Task<List<IcdCode>> Get(string keywordValue)
        {
            return _context.Set<KeywordIcdCode>()
                .Include(kic => kic.Keyword)
                .Where(kic => kic.Keyword.Value.IndexOf(keywordValue, StringComparison.OrdinalIgnoreCase) != -1)
                .Include(kic => kic.IcdCode)
                .Select(kic => kic.IcdCode)
                .ToListAsync();
        }

        [Route("search/{take}")]
        public Task<IList<IcdCode>> Get(int take)
        {
            return GetCodes(take, null);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var code = await _context.Set<IcdCode>()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (code == null)
                return NotFound();

            return Ok(code);
        }

        [Route("search/{take}/{searchString}")]
        public Task<IList<IcdCode>> Get(int take, string searchString)
        {
            return GetCodes(take, searchString);
        }

        private async Task<IList<IcdCode>> GetCodes(int take, string searchString)
        {
            var query = _context.Set<IcdCode>().AsQueryable();
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(icdCode => icdCode.Name.Contains(searchString));
            }

            return await query.Take(take).ToListAsync();
        }
    }
}
