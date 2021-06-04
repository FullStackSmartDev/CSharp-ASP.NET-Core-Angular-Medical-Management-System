using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.ViewModels.ExpressionExecution;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/expression-execution-contexts")]
    public class ExpressionExecutionContextController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IAdmissionService _admissionService;
        private readonly ISelectableItemsService _selectableItemsService;

        public ExpressionExecutionContextController(IPatientService patientService,
            IAdmissionService admissionService,
            ISelectableItemsService selectableItemsService)
        {
            _patientService = patientService;
            _admissionService = admissionService;
            _selectableItemsService = selectableItemsService;
        }
        
        public async Task<IActionResult> Get([FromQuery]Guid admissionId, [FromQuery]Guid patientId)
        {
            var patient = await _patientService.GetByIdWithVitalSigns(patientId);
            var fullAdmissionInfo = await _admissionService
                .GetFullAdmissionInfoById(admissionId);
            
            return Ok(new ExpressionExecutionContextVm
            {
                Patient = patient.Patient,
                VitalSigns = fullAdmissionInfo.VitalSigns,
                BaseVitalSigns = patient.BaseVitalSigns,
                SelectableVariables = _selectableItemsService
                    .GetSelectableVariablesFromHtmlContent(string.Empty, true)
            });
        }
    }
}