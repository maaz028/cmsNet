using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace cmsNetApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IAccountRepository account;

        public AccountController(IAccountRepository account)
        {
            this.account = account;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<AccountModel>> GetAccountDetailsAsync([FromRoute] string id)
        {
            AccountModel accountDetails = await account.AccountDetailsAsync(id);

            if (accountDetails != null)
            {
                return accountDetails;
            }

            return Ok(new
            {
                Message = $"No account found having ID: {id}"
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<AccountModel>> CreateAccount([FromBody] AccountBodyModel model)
        {
            HashSaltService hashSalt = PasswordHashing.GenerateSaltedHash(64, model.Password);

            model.Password = hashSalt.Hash;

            AccountModel newModel = new()
            {
                Email = model.Email,
                Password = model.Password,
                Salt = hashSalt.Salt,
                UpdatedAt = DateTime.Now
            };

            return CreatedAtAction("CreateAccount", await account.CreateAccountAsync(newModel));
        }

        [HttpDelete]
        public async Task<ActionResult<AccountModel>> DeleteAcountAsync([FromQuery] string id)
        {

            AccountModel accountDetails = await account.DeleteAccountAsync(id);

            if (accountDetails != null)
            {
                return Ok(accountDetails);
            }

            return Ok(new
            {
                Message = $"No account found having ID: {id}"
            });
        }

        [HttpPatch]
        public async Task<ActionResult> UpdateEmail([FromBody] AccountBodyModel model)
        {
            AccountModel? accountDetails = await account.UpdateEmailAsync(model.ID, model.Email.Trim());

            if (accountDetails != null)
            {
                return Ok(accountDetails);
            }

            return Ok(new
            {
                Message = $"No account found having ID: {model.ID}"
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<AccountModel>> AuthenticateLoginAsync([FromBody] AccountBodyModel model)
        {
            AccountModel? accountDetails = await account.AuthenticateLoginAsync(model);

            if (accountDetails != null)
            {
                accountDetails.Token = jwtCreationService.CreateJwt("Admin", "Maaz");

                return Ok(accountDetails);
            }

            return Ok(new
            {
                invalidCredentials = true
            });
        }

        [HttpPatch]
        public async Task<ActionResult<bool>> UpdatePassword([FromBody] AccountBodyModel model)
        {

            bool? result = await account.UpdatePasswordAsync(model.ID, model.Password, model.NewPassword);

            if (result != null)
            {
                if ((bool)result)
                {
                    return Ok(new
                    {
                        IsPasswordUpdated = true
                    });
                }

                return Ok(new
                {
                    IsPasswordUpdated = false
                });

            }

            return Ok(new
            {
                Message = $"No account found having ID: {model.ID}"
            });
        }
    }


}