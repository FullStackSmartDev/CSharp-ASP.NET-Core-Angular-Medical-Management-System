using System;
using System.Threading.Tasks;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Company;
using Medico.Domain.Enums;
using Medico.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Medico.Api.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/init")]
    public class InitController : ControllerBase
    {
        private readonly IOptions<MedicoSettingsViewModel> _medicoSettings;
        private readonly IOptions<SendEmailViewModel> _SMTPSettings;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ICompanyService _companyService;

        public InitController(IOptions<MedicoSettingsViewModel> medicoSettings, IOptions<SendEmailViewModel> SMTPSettings,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ICompanyService companyService)
        {
            _medicoSettings = medicoSettings;
            _userManager = userManager;
            _roleManager = roleManager;
            _companyService = companyService;
            _SMTPSettings = SMTPSettings;
        }

        [AllowAnonymous]
        //[HttpPost]
        [HttpGet]
        [Route("{initializationKey}")]
        public async Task<IActionResult> Post(Guid initializationKey)
        {
            var appInitializationKey = _medicoSettings.Value.InitializationKey;
            if (appInitializationKey != initializationKey)
                return BadRequest();

            var superAdminUser = await _userManager
                .FindByEmailAsync(AppConstants.BuildInUsers.SuperAdmin.Email);

            if (superAdminUser != null)
                return Ok();

            //currently password is represented as plain text need to apply
            //simple hashing and do not store plain text
            var superAdminPasswordHash = _medicoSettings
                .Value.SuperAdminPasswordHash;

            await CreateSuperAdminUser(superAdminPasswordHash);

            await CreateUserRole(AppConstants.BuildInRoleNames.SuperAdmin);
            await CreateUserRole(AppConstants.BuildInRoleNames.Physician);
            await CreateUserRole(AppConstants.BuildInRoleNames.Nurse);
            await CreateUserRole(AppConstants.BuildInRoleNames.MedicalAssistant);
            await CreateUserRole(AppConstants.BuildInRoleNames.Admin);

            await AssignSuperAdminRoleToSuperAdminUser();

            await _companyService
                .CreateNewApplicationCompany(BaseCompany);

            return Ok();
        }

        private static CompanyVm BaseCompany =>
            new CompanyVm
            {
                Name = "Medico Office",
                Address = "3507 North Central Ave",
                SecondaryAddress = "Suite 403",
                City = "Phoenix",
                Fax = "8662644201",
                State = 1,
                Phone = "8332633426",
                IsActive = true,
                ZipCode = "85014",
                ZipCodeType = ZipCodeType.FiveDigit,
                WebSiteUrl = "https://medicogroup.azurewebsites.net"
            };

        private async Task AssignSuperAdminRoleToSuperAdminUser()
        {
            var superAdminUser = await _userManager
                .FindByEmailAsync(AppConstants.BuildInUsers.SuperAdmin.Email);

            await _userManager
                .AddToRoleAsync(superAdminUser, AppConstants.BuildInRoleNames.SuperAdmin);
        }

        private Task CreateUserRole(string name)
        {
            var role = new IdentityRole { Name = name };
            return _roleManager.CreateAsync(role);
        }

        private Task<IdentityResult> CreateSuperAdminUser(string superAdminPasswordHash)
        {
            var superAdmin = new ApplicationUser
            {
                Email = AppConstants.BuildInUsers.SuperAdmin.Email,
                UserName = AppConstants.BuildInUsers.SuperAdmin.Name,
                EmailConfirmed = true
            };

            return _userManager.CreateAsync(superAdmin, superAdminPasswordHash);
        }
    }
}