using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IAdmissionRepository
        : IDeletableByIdRepository<Admission>
    {
    }
}