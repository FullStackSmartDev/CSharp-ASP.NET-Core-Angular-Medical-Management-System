using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Company;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Route("api/companies")]
    public class CompanyController : ApiController
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService,
            ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _companyService = companyService;
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]CompanyVm companyViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var isNewCompany =
                companyViewModel.Id == Guid.Empty;

            var companyId = companyViewModel.Id;
            if (!isNewCompany && !await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            Task<CompanyVm> createUpdateCompanyTask;

            if (isNewCompany)
            {
                createUpdateCompanyTask = _companyService
                    .CreateNewApplicationCompany(companyViewModel);
            }
            else
            {
                createUpdateCompanyTask = _companyService
                    .Update(companyViewModel);
            }

            return Ok(await createUpdateCompanyTask);
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompany(id))
                return Unauthorized();

            return Ok(await _companyService.GetById(id));
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> Get(CompanySearchFilterVm companySearchFilterVm)
        {
            return Ok(await _companyService.GetByFilter(companySearchFilterVm));
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_companyService.GetAll(), loadOptions);
        }

        [Authorize]
        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _companyService.GetAll();

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}