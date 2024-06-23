using cmsNetApi;
using Core.Middlewares;
using Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProgramServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  DeveloperExceptionPageOptions options = new ()
  {
    SourceCodeLineCount = 10
  };
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseCors("_myAllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();

    
app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMSNet API V1");
  c.RoutePrefix = string.Empty;
});

app.MapControllerRoute(
  name:"Default",
  pattern:"{controller=Home}/{action=Index}"
  );


  using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

await Seed.SeedDataAsync(services.GetRequiredService<AppDBContext>());

app.Run();
 