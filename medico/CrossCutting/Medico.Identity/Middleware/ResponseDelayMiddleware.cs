using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Medico.Identity.Middleware
{
    //the purpose of this middleware is to delay API outgoing response during
    //local development and simulate the behavior of API hosted on the remote server
    public class ResponseDelayMiddleware
    {
        private readonly RequestDelegate _next;

        public ResponseDelayMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            await _next(httpContext);
            await Task.Delay(2000);
        }
    }
}