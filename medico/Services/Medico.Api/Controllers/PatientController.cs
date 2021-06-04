using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Api.Email;
using Medico.Api.Url;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Patient;
using Medico.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/patients")]
    public class PatientController : ApiController
    {
        private readonly IPatientService _patientService;
        private readonly ISendEmailService _sendEmailService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUniqueUsernameService _uniqueUsernameService;
        private readonly IUserService _userService;
        private readonly IUrlService _urlService;

        public PatientController(IPatientService patientService,
            ICompanySecurityService companySecurityService,
            ISendEmailService sendEmailService,
            UserManager<ApplicationUser> userManager,
            IUniqueUsernameService uniqueUsernameService,
            IUserService userService,
            IUrlService urlService) : base(companySecurityService)
        {
            _patientService = patientService;
            _sendEmailService = sendEmailService;
            _userManager = userManager;
            _uniqueUsernameService = uniqueUsernameService;
            _userService = userService;
            _urlService = urlService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PatientVm patientViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = patientViewModel.CompanyId;

            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var isNewPatient = patientViewModel.Id == Guid.Empty;

            var createUpdateTask = isNewPatient
                ? _patientService.Create(patientViewModel)
                : _patientService.Update(patientViewModel);

            var savedPatient = await createUpdateTask;

            if (!isNewPatient)
                return Ok(savedPatient);

            await _userService.Create(new MedicoApplicationUserViewModel
            {
                Role = "Patient",
                RoleName = "Patient",
                FirstName = savedPatient.FirstName,
                MiddleName = savedPatient.MiddleName,
                LastName = savedPatient.LastName,
                Email = savedPatient.Email,
                Address = savedPatient.PrimaryAddress,
                SecondaryAddress = savedPatient.SecondaryAddress,
                City = savedPatient.City,
                State = savedPatient.State,
                Zip = savedPatient.Zip,
                ZipCodeType = savedPatient.ZipCodeType,
                PrimaryPhone = savedPatient.PrimaryPhone,
                SecondaryPhone = savedPatient.SecondaryPhone,
                EmployeeType = 7,
                Ssn = savedPatient.Ssn,
                Gender = savedPatient.Gender,
                DateOfBirth = savedPatient.DateOfBirth,
                CompanyId = savedPatient.CompanyId,
                IsActive = true
            });

            var password = $"{savedPatient.Email}$M1";
            var userName = _uniqueUsernameService.Get(savedPatient.Email, companyId);

            var newUser = new ApplicationUser
            {
                Email = savedPatient.Email,
                UserName = userName,
                CompanyId = companyId
            };

            var userCreationResult =
                await _userManager.CreateAsync(newUser, password);

            if (!userCreationResult.Succeeded)
            {
                throw new InvalidOperationException(userCreationResult.Errors.First().Description);
            }

            var medicoApplicationUser = await _userManager.FindByNameAsync(userName);

            await _userManager.AddToRoleAsync(medicoApplicationUser, "Patient");

            var code =
                await _userManager.GenerateEmailConfirmationTokenAsync(newUser);

            //token may contain some special characters that should be encoded
            var encodedCode = 
                WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var emailConfirmationUrl = _urlService
                .GenerateEmailConfirmationUrl(newUser.Id, encodedCode);

            var emailConfirmationHeader = string.Format(EmailTemplates.UserEmailConfirmation.Subject,
                savedPatient.FirstName, savedPatient.LastName);
            
            var emailConfirmationBody = string.Format(EmailTemplates.UserEmailConfirmation.Body,
                emailConfirmationUrl);

            await _sendEmailService.SendEmailAsync(savedPatient.Email, emailConfirmationHeader, emailConfirmationBody);

            return Ok(savedPatient);
        }

        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] JsonPatchDocument<PatientPatchVm> patientPatchVm)
        {
            var patientNotesPatch = new PatientPatchVm();
            patientPatchVm.ApplyTo(patientNotesPatch);

            await _patientService.UpdatePatientNotes(patientNotesPatch);

            return Ok();
        }

        public async Task<IActionResult> Get(PatientFilterVm patientSearchFilter)
        {
            return Ok(await _patientService.GetByFilter(patientSearchFilter));
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var location = await _patientService.GetById(id);
            if (location == null)
                return NotFound();

            return Ok(location);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _patientService.Delete(id);
            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            IQueryable<PatientProjectionViewModel> query;

            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                query = Enumerable.Empty<PatientProjectionViewModel>()
                    .AsQueryable();
            else
            {
                loadOptions.PrimaryKey = new[] {"Id"};
                loadOptions.PaginateViaPrimaryKey = true;


                query = _patientService.GetAll()
                    .Where(c => c.CompanyId == companyId);
            }

            //provide ability of case-insensitive search
            //consider to use this configuration value globally
            loadOptions.StringToLower = true;
            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DateRangeDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] {"Id"};
            loadOptions.PaginateViaPrimaryKey = true;

            var query = _patientService.Lookup(loadOptions);

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}