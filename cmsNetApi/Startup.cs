using System.Text;
using Core.Interfaces;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace cmsNetApi
{
    public static class Startup
    {
        public static IServiceCollection AddProgramServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllers(
  options =>
    {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        options.Filters.Add(new AuthorizeFilter(policy));
    }
);
            services.AddDbContext<AppDBContext>(options => options.UseSqlite(config.GetConnectionString("default"), b => b.MigrationsAssembly("cmsNetApi")));

            services.AddScoped<ICategoryRepository, MockCategoryRepository>();
            services.AddScoped<IPostRepository, MockPostRepository>();
            services.AddScoped<IAccountRepository, MockAccountRepository>();
            services.AddSwaggerGen();

            services.AddCors(options =>
            {
                options.AddPolicy(name: "_myAllowSpecificOrigins",
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:4200/")
                                      .AllowAnyOrigin()
                                      .AllowAnyMethod().AllowAnyHeader();
                                  });
            });

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("verysecret..................")),
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

            return services;
        }
    }
}