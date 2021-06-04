using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/vitalsigns")]
    public class VitalSignsController : ApiController
    {
        private readonly IVitalSignsService _vitalSignsService;

        public VitalSignsController(IVitalSignsService vitalSignsService,
            ICompanySecurityService companySecurityService): base(companySecurityService)
        {
            _vitalSignsService = vitalSignsService;
        }

        [Route("last/patient/{patientId}/date/{createDate}")]
        public async Task<IActionResult> GetLastPatientVitalSigns(Guid patientId, DateTime createDate)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _vitalSignsService
                .GetLastPatientVitalSigns(patientId, createDate));
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var vitalSigns = await _vitalSignsService.GetById(id);
            if (vitalSigns == null)
                return Ok();

            var patientId = vitalSigns.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(vitalSigns);
        }

        [Route("patient/{patientId}/admission/{admissionId}")]
        public async Task<IActionResult> Get(Guid patientId, Guid admissionId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            return Ok(await _vitalSignsService.GetByPatientAndAdmissionIds(patientId, admissionId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]VitalSignsViewModel vitalSignsViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = vitalSignsViewModel.PatientId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = vitalSignsViewModel.Id == Guid.Empty
                ? _vitalSignsService.Create(vitalSignsViewModel)
                : _vitalSignsService.Update(vitalSignsViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(PatientAdmissionDxOptionsViewModel vitalSignsDxOptionsViewModel)
        {
            vitalSignsDxOptionsViewModel.PrimaryKey = new[] { "Id" };
            vitalSignsDxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_vitalSignsService.GetAll(vitalSignsDxOptionsViewModel),
                vitalSignsDxOptionsViewModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var vitalSigns = await _vitalSignsService.GetById(id);
            if (vitalSigns == null)
                return Ok();

            var patientId = vitalSigns.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            await _vitalSignsService.Delete(id);
            return Ok();
        }
    }
}
