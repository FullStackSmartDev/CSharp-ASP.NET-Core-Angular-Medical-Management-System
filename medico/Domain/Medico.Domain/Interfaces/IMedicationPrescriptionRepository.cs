using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicationPrescriptionRepository
        : IDeletableByIdRepository<MedicationPrescription>
    {
    }
}