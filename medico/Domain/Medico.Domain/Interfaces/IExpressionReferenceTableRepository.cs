using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IExpressionReferenceTableRepository
        : IDeletableByEntityRepository<ExpressionReferenceTable>
    {
    }
}