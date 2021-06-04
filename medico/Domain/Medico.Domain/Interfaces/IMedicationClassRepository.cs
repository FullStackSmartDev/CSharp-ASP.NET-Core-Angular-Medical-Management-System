using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicationClassRepository
        : IDeletableByIdRepository<MedicationClass>
    {
    }
}
