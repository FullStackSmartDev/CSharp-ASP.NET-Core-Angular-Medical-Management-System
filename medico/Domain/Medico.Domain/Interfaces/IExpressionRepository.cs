using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IExpressionRepository
        : IDeletableByIdRepository<Expression>
    {
    }
}