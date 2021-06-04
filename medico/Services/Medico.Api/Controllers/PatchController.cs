using System;
using Medico.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/patch")]
    public class PatchController : ApiController
    {
        private readonly IHostingEnvironment _environment;

        public PatchController(ICompanySecurityService companySecurityService,
            IHostingEnvironment environment)
            : base(companySecurityService)
        {
            _environment = environment;
        }

        [AllowAnonymous]
        [Route("environment")]
        [HttpGet]
        public string GetEnvironment(Guid companyId)
        {
            return _environment.EnvironmentName;
        }
    }
}