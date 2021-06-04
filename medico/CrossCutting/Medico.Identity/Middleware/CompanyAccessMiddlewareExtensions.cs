using Microsoft.AspNetCore.Builder;

namespace Medico.Identity.Middleware
{
    public static class CompanyAccessMiddlewareExtensions
    {
        public static IApplicationBuilder UseCompanyAccess(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CompanyAccessMiddleware>();
        }

        public static IApplicationBuilder UseCompanyPatientAccess(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CompanyPatientAccessMiddleware>();
        }
    }
}
