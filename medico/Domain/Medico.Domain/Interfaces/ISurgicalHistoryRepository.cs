using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface ISurgicalHistoryRepository 
        : IDeletableByIdRepository<SurgicalHistory>
    {
    }
}
