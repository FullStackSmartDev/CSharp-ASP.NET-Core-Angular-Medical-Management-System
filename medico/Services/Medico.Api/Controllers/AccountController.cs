using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medico.Api.Email;
using Medico.Api.Url;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUniqueUsernameService _uniqueUsernameService;
        private readonly ICompanyService _companyService;
        private readonly ISendEmailService _sendEmailService;
        private readonly IUrlService _urlService;

        public AccountController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IUniqueUsernameService uniqueUsernameService,
            ICompanyService companyService,
            ISendEmailService sendEmailService,
            IUrlService urlService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _uniqueUsernameService = uniqueUsernameService;
            _companyService = companyService;
            _sendEmailService = sendEmailService;
            _urlService = urlService;
        }

        [AllowAnonymous]
        [Route("email/{email}/company/{companyId}")]
        public async Task<ValidationResultViewModel> CheckEmailExistence(string email, Guid companyId)
        {
            var validationResult = new ValidationResultViewModel();
            var userName = _uniqueUsernameService.Get(email, companyId);

            var applicationUser = await _userManager.FindByNameAsync(userName);

            if (applicationUser == null)
            {
                validationResult.IsValid = true;
            }

            return validationResult;
        }

        [HttpPost]
        [Route("password/resetresult")]
        public async Task<bool> ResetPassword([FromBody] LoginViewModel loginViewModel)
        {
            if (!ModelState.IsValid)
                return false;

            var user = await _userManager.FindByEmailAsync(loginViewModel.Email);
            if (user == null)
                return false;

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var passwordChangeResult =
                await _userManager.ResetPasswordAsync(user, resetToken, loginViewModel.Password);

            return passwordChangeResult.Succeeded;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("password/resetbyuserid")]
        public async Task<bool> ResetPasswordByUserId([FromBody] ResetPasswordViewModel resetPasswordViewModel)
        {
            if (!ModelState.IsValid)
                return false;

            var user = await _userManager.FindByIdAsync(resetPasswordViewModel.UserId);
            if (user == null)
                return false;

            if (string.IsNullOrEmpty(resetPasswordViewModel.Code))
            {
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordChangeResult =
                    await _userManager.ResetPasswordAsync(user, resetToken, resetPasswordViewModel.Password);
                return passwordChangeResult.Succeeded;
            }
            else
            {
                var originalCode =
                        Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetPasswordViewModel.Code));
                var passwordChangeResult =
                    await _userManager.ResetPasswordAsync(user, originalCode, resetPasswordViewModel.Password);
                return passwordChangeResult.Succeeded;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("password")]
        public async Task<bool> Post([FromBody] LoginViewModel loginViewModel)
        {
            if (!ModelState.IsValid)
                return false;

            var user = await _userManager.FindByEmailAsync(loginViewModel.Email);
            if (user == null)
                return false;

            var validationResult = _userManager.PasswordHasher.VerifyHashedPassword(user,
                user.PasswordHash, loginViewModel.Password);

            return validationResult == PasswordVerificationResult.Success;
        }

        [AllowAnonymous]
        [Route("password/{password}")]
        public async Task<ValidationResultViewModel> CheckPasswordComplexity(string password)
        {
            var validationResult = new ValidationResultViewModel();

            var passwordValidator = new PasswordValidator<ApplicationUser>();
            var result = await passwordValidator
                .ValidateAsync(_userManager, null, password);

            validationResult.IsValid = result.Succeeded;

            return validationResult;
        }

        [Route("login")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ApplicationUserViewModel> LogIn([FromBody]LoginViewModel loginViewModel)
        {
            var companyId = loginViewModel.CompanyId;

            var applicationUserViewModel = new ApplicationUserViewModel
            {
                IsAuthenticated = false,
                CompanyId = companyId
            };

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);

                applicationUserViewModel.Errors.AddRange(errors);

                return applicationUserViewModel;
            }

            var email = loginViewModel.Email;
            var username = _uniqueUsernameService.Get(email, companyId);

            var applicationUser = await _userManager.FindByNameAsync(username)
                ?? await _userManager.FindByEmailAsync(email);

            if (applicationUser == null || applicationUser.CompanyId != null && applicationUser.CompanyId.Value != companyId)
            {
                applicationUserViewModel.Errors.Add($"The user with such email '{loginViewModel.Email}' doesn't exist in the company.");
                return applicationUserViewModel;
            }

            var company = await _companyService.GetById(companyId);
            if (company != null && !company.IsActive)
            {
                applicationUserViewModel.Errors.Add("The company where user is registered is inactive.");
                return applicationUserViewModel;
            }

            var result = await _signInManager
                .PasswordSignInAsync(applicationUser.UserName, loginViewModel.Password, false, true);

            if (!result.Succeeded)
            {
                applicationUserViewModel.Errors.Add("The password is wrong");
                return applicationUserViewModel;
            }

            var userRoles = await _userManager.GetRolesAsync(applicationUser);

            applicationUserViewModel.IsAuthenticated = true;

            foreach (var userRole in userRoles)
            {
                applicationUserViewModel.Roles.Add(userRole);
            }

            return applicationUserViewModel;
        }

        [Route("login")]
        [HttpGet]
        [AllowAnonymous]
        public IActionResult NotAuthorized()
        {
            return Unauthorized();
        }

        [Route("forbid")]
        [HttpGet]
        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return StatusCode(403);
        }

        [Route("logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("confirm-email")]
        public async Task<ValidationResultViewModel> ConfirmEmail(string userId, string code)
        {
            var validationResult = new ValidationResultViewModel();

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            {
                return validationResult;
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                if (user.EmailConfirmed)
                {
                    return validationResult;
                }
                else
                {
                    var originalCode =
                        Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));

                    var result = await _userManager.ConfirmEmailAsync(user, originalCode);

                    if (result.Succeeded)
                    {
                        validationResult.IsValid = true;
                    }
                }
            }

            return validationResult;
        }

        [AllowAnonymous]
        [Route("forgot-password/email/{email}")]
        [HttpGet]
        public async Task<ValidationResultViewModel> ForgotPassword(string email)
        {
            var validationResult = new ValidationResultViewModel();

            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                validationResult.IsValid = true;

                var code =
                await _userManager.GeneratePasswordResetTokenAsync(user);

                //token may contain some special characters that should be encoded
                var encodedCode =
                    WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                var forgotPasswordUrl = _urlService
                    .GenerateForgotPasswordUrl(user.Id, encodedCode);

                var forgotPasswordHeader = string.Format(EmailTemplates.UserForgotPassword.Subject);

                var forgotPasswordBody = string.Format(EmailTemplates.UserForgotPassword.Body,
                    forgotPasswordUrl);

                await _sendEmailService.SendEmailAsync(user.Email, forgotPasswordHeader, forgotPasswordBody);
            }

            return validationResult;
        }
    }
}