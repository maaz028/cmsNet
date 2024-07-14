using System.Net;
using cmsNetApi;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Core.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context )
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {               
                _logger.LogError(exception, exception.Message);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                await context.Response.WriteAsJsonAsync(
                    new ApiExceptionResponse((int)HttpStatusCode.InternalServerError, exception.Message, exception.StackTrace)
                );
            }
        }
    }
}