using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/basevitalsigns")]
    public class BaseVitalSignsController : ApiController
    {
        private readonly IBaseVitalSignsService _baseVitalSignsService;

        public BaseVitalSignsController(IBaseVitalSignsService baseVitalSignsService, 
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _baseVitalSignsService = baseVitalSignsService;
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(Guid patientId)
        {
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _baseVitalSignsService.GetByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]BaseVitalSignsViewModel baseVitalSignsViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = baseVitalSignsViewModel.PatientId;
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = baseVitalSignsViewModel.Id == Guid.Empty
                ? _baseVitalSignsService.Create(baseVitalSignsViewModel)
                : _baseVitalSignsService.Update(baseVitalSignsViewModel);

            var savedVitalSigns = await createUpdateTask;

            return Ok(savedVitalSigns);
        }
    }
}