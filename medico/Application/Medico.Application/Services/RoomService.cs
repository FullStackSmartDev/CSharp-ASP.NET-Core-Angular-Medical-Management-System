using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class RoomService : BaseDeletableByIdService<Room, RoomViewModel>, IRoomService
    {
        public RoomService(IRoomRepository roomRepository,
            IMapper mapper): base(roomRepository, mapper)
        {

        }

        public IQueryable<RoomViewModel> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<RoomViewModel>();
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public async Task<IEnumerable<RoomViewModel>> GetByLocationId(Guid locationId)
        {
            return await Repository.GetAll()
                .Where(r => r.LocationId == locationId)
                .ProjectTo<RoomViewModel>()
                .ToListAsync();
        }

        public IQueryable<LookupViewModel> Lookup(RoomDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>().AsQueryable();

            var locationId = loadOptions.LocationId;

            var query = Repository.GetAll()
                .Include(r => r.Location)
                .Where(r => r.Location.IsActive && r.Location.CompanyId == companyId && r.IsActive);

            if (locationId != Guid.Empty)
            {
                query = query.Where(r => r.LocationId == locationId);
            }

            return query.ProjectTo<LookupViewModel>();
        }

        public IQueryable<RoomWithLocationViewModel> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<RoomWithLocationViewModel>().AsQueryable();

            return Repository.GetAll().Include(r => r.LocationId)
                .Where(r => r.Location.CompanyId == companyId)
                .ProjectTo<RoomWithLocationViewModel>();
        }
    }
}
