using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Admission;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/admission")]
    public class AdmissionController : ApiController
    {
        private readonly IAdmissionService _admissionService;
        private readonly IAppointmentService _appointmentService;
        private readonly IPatientService _patientService;

        public AdmissionController(IAdmissionService admissionService,
            ICompanySecurityService companySecurityService,
            IPatientService patientService, IAppointmentService appointmentService)
            : base(companySecurityService)
        {
            _admissionService = admissionService;
            _patientService = patientService;
            _appointmentService = appointmentService;
        }

        [HttpGet]
        [Route("appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointmentId(Guid appointmentId)
        {
            var admission = await _admissionService.GetByAppointmentId(appointmentId);
            if (admission == null)
                return Ok();

            var isCurrentUserHaveAccessToCompanyAdmission =
                await CompanySecurityService
                    .UserHaveAccessToCompanyAdmission(admission.Id);

            if (!isCurrentUserHaveAccessToCompanyAdmission)
                return Unauthorized();

            return Ok(admission);
        }

        [HttpGet]
        [Route("previous/patient/{patientId}/date/{fromDate}")]
        public async Task<IActionResult> GetPatientLastVisit(Guid patientId, DateTime fromDate)
        {
            var isCurrentUserHaveAccessToCompanyPatient =
                await CompanySecurityService
                    .UserHaveAccessToCompanyPatient(patientId);

            if (!isCurrentUserHaveAccessToCompanyPatient)
                return Unauthorized();

            return Ok(await _admissionService.GetPreviousPatientAdmissions(patientId, fromDate));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AdmissionVm admissionViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var appointmentId = admissionViewModel.AppointmentId;
            var appointment = await _appointmentService.GetById(appointmentId);
            if (appointment == null)
                return BadRequest();

            var appointmentCompanyId = appointment.CompanyId;

            var patientId = admissionViewModel.PatientId;
            var patient = await _patientService.GetById(patientId);
            if (patient == null)
                return BadRequest();

            var patientCompanyId = patient.CompanyId;

            if (appointmentCompanyId != patientCompanyId)
                return Unauthorized();

            var isCurrentUserHaveAccessToCompany =
                await CompanySecurityService.UserHaveAccessToCompany(patientCompanyId);

            if (!isCurrentUserHaveAccessToCompany)
                return Unauthorized();

            var createUpdateTask = admissionViewModel.Id == Guid.Empty
                ? _admissionService.Create(admissionViewModel)
                : _admissionService.Update(admissionViewModel);

            var admission = await createUpdateTask;

            return Ok(admission);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var isCurrentUserHaveAccessToCompany =
                await CompanySecurityService
                    .UserHaveAccessToCompanyAdmission(id);

            if (!isCurrentUserHaveAccessToCompany)
                return Unauthorized();

            return Ok(await _admissionService.GetById(id));
        }
    }
}
