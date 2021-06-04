using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IRoomService
    {
        IQueryable<RoomViewModel> GetAll();

        Task<RoomViewModel> GetById(Guid id);

        Task<RoomViewModel> Create(RoomViewModel locationViewModel);

        Task<RoomViewModel> Update(RoomViewModel locationViewModel);

        Task Delete(Guid id);

        Task<IEnumerable<RoomViewModel>> GetByLocationId(Guid locationId);

        IQueryable<LookupViewModel> Lookup(RoomDxOptionsViewModel loadOptions);

        IQueryable<RoomWithLocationViewModel> Grid(CompanyDxOptionsViewModel loadOptions);
    }
}