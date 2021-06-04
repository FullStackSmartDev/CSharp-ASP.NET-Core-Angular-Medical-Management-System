using System;
using System.Threading.Tasks;
using Medico.Domain.Constants;
using Medico.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Medico.Identity.Middleware
{
    public class CompanyPatientAccessMiddleware
    {
        private readonly RequestDelegate _next;

        public CompanyPatientAccessMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, IUser user)
        {
            var patientIdStringValues = httpContext.Request.Query["patientId"];
            if (patientIdStringValues.Count == 0)
                await _next(httpContext);
            else
            {
                var patientIdString = patientIdStringValues[0];
                var parseResult =
                    Guid.TryParse(patientIdString, out var patientIdGuid);

                if (!parseResult)
                {
                    httpContext.Response.StatusCode = 400;
                    await httpContext.Response.WriteAsync("Invalid request data");
                    return;
                }

                if (patientIdGuid == Guid.Empty)
                    await _next(httpContext);
                else
                {
                    var isTestPatientForExpressionExecution =
                        patientIdGuid == Guid.Parse(ExpressionTestConstants.Ids.PatientId);

                    if (isTestPatientForExpressionExecution)
                        await _next(httpContext);
                    else
                    {
                        var isUserHasAccessToCompanyPatient = await user.HasAccessToCompanyPatient(patientIdGuid);
                        if (isUserHasAccessToCompanyPatient)
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
    }
}