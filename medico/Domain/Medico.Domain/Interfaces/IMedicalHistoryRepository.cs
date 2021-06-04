using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicalHistoryRepository 
        : IDeletableByIdRepository<MedicalHistory>
    {
    }
}
