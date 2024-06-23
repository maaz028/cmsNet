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
                _logger.LogError(exception, "Exception ocurred {Message}", exception.Message);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new {
                    Exceptions = new {
                    StackTrace = exception.StackTrace,
                    Message = exception.Message,
                    InnerException = exception.InnerException.Data,
                    Data = exception.Data
                }
                });
            }
        }
    }
}