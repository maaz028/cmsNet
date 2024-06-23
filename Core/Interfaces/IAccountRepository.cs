using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Interfaces
{
    public interface IAccountRepository
    {
        Task<AccountModel> CreateAccountAsync(AccountModel model);

        Task<AccountModel?> AccountDetailsAsync(string id);

        Task<AccountModel> UpdateAccountDetailsAsync(AccountBodyModel id);

        Task<AccountModel?> DeleteAccountAsync(string id);

        Task<AccountModel?> AuthenticateLoginAsync(AccountBodyModel model);

        Task<AccountModel?> UpdateEmailAsync(string id, string email);

        Task<bool?> UpdatePasswordAsync(string id, string currentPassword, string newPassword);
        

    }
}