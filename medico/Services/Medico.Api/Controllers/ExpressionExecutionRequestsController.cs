using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels.ExpressionExecution;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/expression-execution-requests")]
    public class ExpressionExecutionRequestsController : ApiController
    {
        private readonly IExpressionExecutionService _expressionExecutionService;
        private readonly IAdmissionService _admissionService;

        public ExpressionExecutionRequestsController(IExpressionExecutionService expressionExecutionService,
            IAdmissionService admissionService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _expressionExecutionService = expressionExecutionService;
            _admissionService = admissionService;
        }

        [HttpPost]
        [Route("calculation-result")]
        public async Task<IActionResult> CreateExpressionExecutionResult(
            [FromBody] ExpressionExecutionRequestVm expressionExecutionRequest)
        {
            return Ok(new
            {
                ExpressionResult = await _expressionExecutionService
                    .CalculateExpression(expressionExecutionRequest)
            });
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExpressionExecutionRequestVm expressionExecutionRequest)
        {
            var admissionId = expressionExecutionRequest.AdmissionId;
            if (admissionId == Guid.Empty)
                return BadRequest();

            var admission = await _admissionService.GetById(admissionId);
            if (admission == null)
                return NotFound();

            var patientId = admission.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(new
            {
                ExpressionResult =
                    await _expressionExecutionService
                        .CalculateExpressionsInTemplate(expressionExecutionRequest)
            });
        }
    }
}