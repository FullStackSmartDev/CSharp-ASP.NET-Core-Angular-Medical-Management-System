using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class LocationRoomViewRepository
        : ViewRepository<LocationRoom>, ILocationRoomViewRepository
    {
        public LocationRoomViewRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
