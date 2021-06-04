using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        //[Authorize]
        [Route("status")]
        public string GetHealthStatus(IHostingEnvironment env)
        {
            return $"Environment: {env.EnvironmentName} is ready";
        }
    }
}