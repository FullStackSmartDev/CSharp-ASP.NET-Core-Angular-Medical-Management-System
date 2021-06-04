using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IAppointmentRepository
        : IDeletableByIdRepository<Appointment>
    {
    }
}
