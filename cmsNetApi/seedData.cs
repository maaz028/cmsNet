using Core.Models;
using Core.Services;
using Infrastructure.Repositories;

namespace cmsNetApi
{
    public static class Seed
    {
        public static async Task SeedDataAsync(AppDBContext context)
        {
            if (!context.Account.Any())
            {
                HashSaltService hashSalt = PasswordHashing.GenerateSaltedHash(64, "admin");

               await context.Account.AddAsync(new()
                {
                    Email = "admin@test.com",
                    Password = hashSalt.Hash,
                    Salt = hashSalt.Salt,
                    UpdatedAt = DateTime.Now
                });
            }

            if (context.ChangeTracker.HasChanges()) 
            {
                await context.SaveChangesAsync();
            }
        }
    }
}