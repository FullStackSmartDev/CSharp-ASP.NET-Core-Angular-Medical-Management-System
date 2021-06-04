using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicalRecordRepository
        : IDeletableByIdRepository<MedicalRecord>
    {
    }
}