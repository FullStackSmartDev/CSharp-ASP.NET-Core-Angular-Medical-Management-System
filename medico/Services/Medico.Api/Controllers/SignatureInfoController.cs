using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/signatureinfo")]
    public class SignatureInfoController : ApiController
    {
        private readonly ISignatureInfoService _signatureInfoService;

        public SignatureInfoController(ISignatureInfoService signatureInfoService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _signatureInfoService = signatureInfoService;
        }

        [Route("admission/{admissionId}")]
        public async Task<IActionResult> GetByAdmissionId(Guid admissionId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            return Ok(await _signatureInfoService.GetByAdmissionId(admissionId));
        }

        [Authorize(Roles = "SuperAdmin,Physician")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]SignatureInfoViewModel signatureInfoViewModel)
        {
            if (!ModelState.IsValid)
                return Ok();

            var admissionId = signatureInfoViewModel.AdmissionId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyAdmission(admissionId))
                return Unauthorized();

            var createUpdateTask =  signatureInfoViewModel.Id == Guid.Empty
                ? _signatureInfoService.Create(signatureInfoViewModel)
                : _signatureInfoService.Update(signatureInfoViewModel);

            await createUpdateTask;
            return Ok();
        }
    }
}
