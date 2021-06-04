using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/room")]
    public class RoomController : ApiController
    {
        private readonly IRoomService _roomService;
        private readonly ILocationService _locationService;

        public RoomController(IRoomService roomService,
            ICompanySecurityService companySecurityService, ILocationService locationService): base(companySecurityService)
        {
            _roomService = roomService;
            _locationService = locationService;
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RoomViewModel roomViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var location = await _locationService
                .GetById(roomViewModel.LocationId);

            if (location == null)
                return BadRequest();

            var companyId = location.CompanyId;
            if (!await CompanySecurityService.UserHaveAccessToCompany(companyId))
                return Unauthorized();

            var createUpdateTask = roomViewModel.Id == Guid.Empty
                ? _roomService.Create(roomViewModel)
                : _roomService.Update(roomViewModel);

            await createUpdateTask;

            return Ok();
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var room = await _roomService.GetById(id);
            if (room == null)
                return Ok();

            return Ok(room);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [Route("location/{locationId}")]
        public Task<IEnumerable<RoomViewModel>> GetByLocationId(Guid locationId)
        {
            return _roomService.GetByLocationId(locationId);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var room = await _roomService.GetById(id);
            if (room == null)
                return Ok();

            var locationId = room.LocationId;

            if (!await CompanySecurityService.UserHaveAccessToCompanyLocation(locationId))
                return Unauthorized();

            await _roomService.Delete(id);
            return Ok();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [Route("dx/grid")]
        public object DxGridData(CompanyDxOptionsViewModel loadOptions)
        {
            var query = _roomService.Grid(loadOptions);

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(RoomDxOptionsViewModel loadOptions)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var query = _roomService.Lookup(loadOptions);

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}
