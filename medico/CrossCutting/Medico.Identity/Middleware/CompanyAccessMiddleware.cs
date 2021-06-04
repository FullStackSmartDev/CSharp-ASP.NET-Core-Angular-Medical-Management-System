using System;
using System.Threading.Tasks;
using Medico.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Medico.Identity.Middleware
{
    public class CompanyAccessMiddleware
    {
        private readonly RequestDelegate _next;

        public CompanyAccessMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, IUser user)
        {
            var companyIdStringValues = httpContext.Request.Query["companyId"];
            if (companyIdStringValues.Count == 0)
                await _next(httpContext);
            else
            {
                var companyId = companyIdStringValues[0];
                var parseResult = Guid.TryParse(companyId, out var companyIdGuid);

                if (!parseResult)
                {
                    httpContext.Response.StatusCode = 400;
                    await httpContext.Response.WriteAsync("Invalid request data");
                    return;
                }

                if (companyIdGuid == Guid.Empty)
                    await _next(httpContext);

                var isUserHasAccessToCompany = await user.HasAccessToCompany(companyIdGuid);
                if (isUserHasAccessToCompany)
                    await _next(httpContext);
                else
                {
                    httpContext.Response.StatusCode = 403;
                    await httpContext.Response.WriteAsync("User cannot request data about this company");
                }
            }
        }
    }
}
