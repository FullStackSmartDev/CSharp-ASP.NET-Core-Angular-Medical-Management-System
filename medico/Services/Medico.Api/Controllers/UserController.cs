using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/user")]
    public class UserController : ApiController
    {
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUniqueUsernameService _uniqueUsernameService;

        public UserController(IUserService userService,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ICompanySecurityService companySecurityService,
            IUniqueUsernameService usernameService) : base(companySecurityService)
        {
            _userService = userService;
            _userManager = userManager;
            _roleManager = roleManager;
            _uniqueUsernameService = usernameService;
        }

        [Route("email/{email}")]
        [HttpGet]
        public async Task<EntityExistenceViewModel> GetUserExistence(string email)
        {
            var entityExistenceModel = new EntityExistenceViewModel();

            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
                entityExistenceModel.IsEntityExist = true;

            return entityExistenceModel;
        }

        [Route("companies/email/{email}")]
        [HttpGet]
        public async Task<IEnumerable<LookupViewModel>> GetUserCompanies(string email)
        {
            return await _userService.GetUserCompanies(email);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var user = await _userService.GetByUserId(id);
            if (user == null)
                return Ok();

            var companyId = user.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(user);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MedicoApplicationCreateUserViewModel medicoApplicationCreateUserViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = medicoApplicationCreateUserViewModel.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var isNewUser = medicoApplicationCreateUserViewModel.Id == Guid.Empty;

            var createUpdateTask = isNewUser
                ? _userService.Create(medicoApplicationCreateUserViewModel)
                : _userService.Update(medicoApplicationCreateUserViewModel);

            await createUpdateTask;

            var newRoleId = medicoApplicationCreateUserViewModel.Role;
            var newRole = await _roleManager.FindByIdAsync(newRoleId);

            var email = medicoApplicationCreateUserViewModel.Email;
            var username = _uniqueUsernameService.Get(email, companyId);

            if (isNewUser)
            {
                var password = medicoApplicationCreateUserViewModel.Password;

                var newUser = new ApplicationUser
                {
                    Email = email,
                    UserName = username,
                    EmailConfirmed = true,
                    CompanyId = companyId
                };

                await _userManager.CreateAsync(newUser, password);
            }

            var medicoApplicationUser = await _userManager.FindByNameAsync(username);

            if (isNewUser)
            {
                await _userManager.AddToRoleAsync(medicoApplicationUser, newRole.Name);
            }
            else
            {
                var userRoles = await _userManager.GetRolesAsync(medicoApplicationUser);
                if (userRoles.Contains(newRole.Name))
                    return Ok();

                await _userManager.RemoveFromRolesAsync(medicoApplicationUser, userRoles);
                await _userManager.AddToRoleAsync(medicoApplicationUser, newRole.Name);
            }

            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _userService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Authorize]
        [Route("dx/lookup")]
        public object DxLookupData(UserDxOptionsViewModel loadOptions)
        {
            var query = _userService.Lookup(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var medicoApplicationUser = await _userService.GetById(id);
            if (medicoApplicationUser == null)
                return Ok();

            var companyId = medicoApplicationUser.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            await _userService.Delete(id);

            var email = medicoApplicationUser.Email;
            var username = _uniqueUsernameService.Get(email, companyId);

            var identityUser = await _userManager.FindByNameAsync(username);

            if (identityUser == null)
                return Ok();

            await _userManager.DeleteAsync(identityUser);

            return Ok();
        }
    }
}
