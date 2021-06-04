using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/patientinsurance")]
    public class PatientInsuranceController : ApiController
    {
        private readonly IPatientInsuranceService _patientInsuranceService;

        public PatientInsuranceController(IPatientInsuranceService patientInsuranceService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _patientInsuranceService = patientInsuranceService;
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> Get(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _patientInsuranceService.GetByPatientId(patientId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]PatientInsuranceViewModel patientInsuranceViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = patientInsuranceViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = patientInsuranceViewModel.Id == Guid.Empty
                ? _patientInsuranceService.Create(patientInsuranceViewModel)
                : _patientInsuranceService.Update(patientInsuranceViewModel);

            var savedPatientInsurance = await createUpdateTask;

            return Ok(savedPatientInsurance);
        }
    }
}
