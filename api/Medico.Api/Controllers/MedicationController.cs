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
    [Route("api/ndc")]
    public class MedicationController : Controller
    {
        private readonly MedicoContext _context;

        public MedicationController(MedicoContext context)
        {
            _context = context;
        }

        [Route("search/{take}")]
        public async Task<IActionResult> Get(int take)
        {
            var codes = await GetMedication(take, null);
            return Ok(codes);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var code = await _context.Set<Medication>()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (code == null)
                return NotFound();

            return Ok(code);
        }

        [Route("search/{take}/{searchString}")]
        public async Task<IActionResult> Get(int take, string searchString)
        {
            var codes = await GetMedication(take, searchString);
            return Ok(codes);
        }

        private async Task<IList<Medication>> GetMedication(int take, string searchString)
        {
            var query = _context.Set<Medication>().AsQueryable();
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(medication =>
                    medication.SubstanceName.Contains(searchString) || medication.NonProprietaryName.Contains(searchString));
            }

            return await query.Take(take).ToListAsync();
        }
    }
}