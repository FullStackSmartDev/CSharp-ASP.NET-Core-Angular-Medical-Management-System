using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class AppointmentGridItemRepository
        : ViewRepository<AppointmentGridItem>, IAppointmentGridItemRepository
    {
        public AppointmentGridItemRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
