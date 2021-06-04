using Medico.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    public class ApiController : ControllerBase
    {
        protected ApiController(ICompanySecurityService companySecurityService)
        {
            CompanySecurityService = companySecurityService;
        }

        protected ICompanySecurityService CompanySecurityService { get; }
    }
}