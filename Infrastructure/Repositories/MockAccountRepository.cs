using Core.Models;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Core.Services;

namespace Infrastructure.Repositories
{
    public class MockAccountRepository : IAccountRepository
    {
        private readonly AppDBContext context;

        public MockAccountRepository(AppDBContext context)
        {
            this.context = context;
        }
        public async Task<AccountModel?> AccountDetailsAsync(string id)
        {
            AccountModel account =  await context.Account.FindAsync(id);

            if (account != null) 
            {
                return account;
            }

            return null;
        }

        public async Task<AccountModel?> AuthenticateLoginAsync(AccountBodyModel model)
        {
            AccountModel account = await context.Account.FirstOrDefaultAsync(x => x.Email == model.Email);
            
            if (account != null) 
            {
                return PasswordHashing.VerifyPassword(model.Password, account.Password, account.Salt) ? account : null;
            }

            return null;
        }

        public async Task<AccountModel> CreateAccountAsync(AccountModel model)
        {
            await context.Account.AddAsync(model);

            await context.SaveChangesAsync();

            return model;
        }

        public async Task<AccountModel?> DeleteAccountAsync(string id)
        {
            AccountModel? account = await context.Account.FindAsync(id);

            if (account == null) 
            {
                return null;
            }

            context.Account.Remove(account);

            await context.SaveChangesAsync();

            return account;
        }

        public async Task<AccountModel> UpdateAccountDetailsAsync(AccountBodyModel model)
        {
            AccountModel? account = await context.Account.FindAsync(model.ID);

            account.Email = model.Email;  
            account.Password = model.Password;           
            account.UpdatedAt = DateTime.Now;

            await context.SaveChangesAsync();

            return account;
        }

        public async Task<AccountModel?> UpdateEmailAsync(string id, string email)
        {
            AccountModel account = await context.Account.FindAsync(id);

            if (account != null) 
            {
                account.Email = email;

                await context.SaveChangesAsync();

                return account;
            }

            return null;
        }

        public async Task<bool?> UpdatePasswordAsync(string id, string currentPassword, string newPassword)
        {
            AccountModel? model = await context.Account.FindAsync(id);
            
            if (model != null) 
            {

                if (PasswordHashing.VerifyPassword(currentPassword, model.Password, model.Salt)) 
                {
                    HashSaltService hashSalt = PasswordHashing.GenerateSaltedHash(64, newPassword);
                    
                    model.Password = hashSalt.Hash;
                    model.Salt = hashSalt.Salt;

                    await context.SaveChangesAsync();

                    return true;
                }

                return false;
            }

            return null;
        }
    }
}