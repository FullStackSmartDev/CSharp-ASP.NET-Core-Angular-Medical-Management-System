using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/location")]
    public class LocationController : ApiController
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _locationService = locationService;
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]LocationViewModel locationViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var companyId = locationViewModel.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var createUpdateTask = locationViewModel.Id == Guid.Empty
                ? _locationService.Create(locationViewModel)
                : _locationService.Update(locationViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var location = await _locationService.GetById(id);
            if (location == null)
                return Ok();

            var companyId = location.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            return Ok(location);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var location = await _locationService.GetById(id);
            if (location == null)
                return Ok();

            var companyId = location.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            await _locationService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _locationService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DateRangeDxOptionsViewModel loadOptions)
        {
            var query = _locationService.Lookup(loadOptions);

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