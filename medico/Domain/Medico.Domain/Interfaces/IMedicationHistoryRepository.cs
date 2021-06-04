using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicationHistoryRepository
        : IDeletableByIdRepository<MedicationHistory>
    {
    }
}
