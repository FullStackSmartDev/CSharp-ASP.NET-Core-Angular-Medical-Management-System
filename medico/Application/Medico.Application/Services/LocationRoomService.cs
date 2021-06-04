using System.Linq;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;

namespace Medico.Application.Services
{
    public class LocationRoomService : ILocationRoomService
    {
        private readonly ILocationRoomViewRepository _locationRoomViewRepository;

        public LocationRoomService(ILocationRoomViewRepository locationRoomViewRepository)
        {
            _locationRoomViewRepository = locationRoomViewRepository;
        }

        public IQueryable<LocationRoomViewModel> GetAll()
        {
            return _locationRoomViewRepository
                .GetAll()
                .ProjectTo<LocationRoomViewModel>();
        }
    }
}
