using Microsoft.AspNetCore.Builder;

namespace Medico.Identity.Middleware
{
    public static class ResponseDelayMiddlewareExtensions
    {
        public static IApplicationBuilder UseResponseDelay(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ResponseDelayMiddleware>();
        }
    }
}