using Microsoft.AspNetCore.Mvc;
using System;

namespace Medico.Api.Controllers
{
    [Route("api/heartbeat")]
    public class HeartbeatController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok($"Health status: success. Date: {DateTime.Now}");
        }
    }
}