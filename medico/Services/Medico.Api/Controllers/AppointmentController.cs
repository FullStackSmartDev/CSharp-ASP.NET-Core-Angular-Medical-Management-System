using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/appointment")]
    public class AppointmentController : ApiController
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IAdmissionService _admissionService;

        public AppointmentController(IAppointmentService appointmentService,
            ICompanySecurityService companySecurityService,
            IAdmissionService admissionService) : base(companySecurityService)
        {
            _appointmentService = appointmentService;
            _admissionService = admissionService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var appointment = await _appointmentService.GetById(id);
            if (appointment == null)
                return Ok(null);

            var companyId = appointment.CompanyId;

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(appointment);
        }

        [HttpGet]
        [Route("admission/{admissionId}")]
        public async Task<IActionResult> GetByAdmissionId(Guid admissionId)
        {
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            return Ok(await _appointmentService.GetByAdmissionId(admissionId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AppointmentViewModel appointmentViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = appointmentViewModel.CompanyId;

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var appointmentId = appointmentViewModel.Id;

            var isNewAppointmentCreation = appointmentId == Guid.Empty;
            if (!isNewAppointmentCreation)
            {
                //before appointment updating we should check if admission was already created for this appointment
                //and set admissionId in appointment

                var admission = await _admissionService.GetByAppointmentId(appointmentId);
                if (admission != null)
                {
                    appointmentViewModel.AdmissionId = admission.Id;
                }

            }

            var createUpdateTask = isNewAppointmentCreation
                ? _appointmentService.Create(appointmentViewModel)
                : _appointmentService.Update(appointmentViewModel);

            await createUpdateTask;

            return Ok();
        }

        [HttpGet]
        [Route("last/patient/{patientId}/date/{currentDate}")]
        public async Task<IActionResult> GetPatientLastVisit(Guid patientId, DateTime currentDate)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _appointmentService.GetPatientLastVisit(patientId, currentDate));
        }

        [HttpGet]
        [Route("previous/{patientId}/date/{currentDate}")]
        public async Task<IActionResult> GetPatientPreviousVisits(Guid patientId, DateTime currentDate)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _appointmentService.GetPatientPreviousVisits(patientId, currentDate));
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var appointment = await _appointmentService.GetById(id);
            if (appointment == null)
                return Ok();

            var companyId = appointment.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var admission = await _admissionService.GetByAppointmentId(appointment.Id);
            if (admission != null)
                await _admissionService.Delete(admission.Id);

            await _appointmentService.Delete(id);
            return Ok();
        }

        [Route("griditem/dx/grid")]
        public object GridItems(AppointmentDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var query = _appointmentService
                .GetAllAppointmentGridItems(loadOptions);

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("griditem/{gridItemId}")]
        public async Task<IActionResult> GetAppointmentGridItemById(Guid gridItemId)
        {
            var appointmentGridItem =
                await _appointmentService.GetAppointmentGridItemById(gridItemId);

            var companyId = appointmentGridItem.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(appointmentGridItem);
        }

        [HttpGet]
        [Route("location/{locationId}")]
        public async Task<IActionResult> GetByLocationId(Guid locationId)
        {
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyLocation(locationId))
                return Unauthorized();

            return Ok(await _appointmentService.GetByLocationId(locationId));
        }

        [HttpGet]
        [Route("room/{roomId}")]
        public async Task<IActionResult> GetByRoomId(Guid roomId)
        {
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyRoom(roomId))
                return Unauthorized();

            return Ok(await _appointmentService.GetByRoomId(roomId));
        }

        [HttpGet]
        [Route("user/{userId}")]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            if (!await CompanySecurityService
                .UserHaveAccessToCompanyEmployee(userId))
                return Unauthorized();

            return Ok(await _appointmentService.GetByUserId(userId));
        }

        [Route("dx/grid")]
        public object DxGridData(AppointmentDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var query = _appointmentService
                .GetAll(loadOptions);

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}