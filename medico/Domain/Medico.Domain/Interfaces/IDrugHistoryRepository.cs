using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IDrugHistoryRepository
        : IDeletableByIdRepository<DrugHistory>
    {
    }
}
