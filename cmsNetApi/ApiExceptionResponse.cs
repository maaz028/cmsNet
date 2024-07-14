namespace cmsNetApi
{
    public class ApiExceptionResponse
    {
        public ApiExceptionResponse(int statusCode, string? message = null, string? details = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessage(statusCode);
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }

        private static string GetDefaultMessage(int statusCode) 
        {
            return statusCode switch
            {
                409 => "resource already exists",
                201 => "resource added",
                204 => "resource deleted",
                400 => "bad request",
                401 => "You are not authorized",
                404 => "Resource not found",
                500 => "The server has encountered a situation it does not know how to handle.",
                _ => "An Error ocurred"
            };
        }
    }
}