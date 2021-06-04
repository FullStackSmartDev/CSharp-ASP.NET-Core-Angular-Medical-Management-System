using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface ITemplateExpressionRepository
        : IDeletableByEntityRepository<TemplateExpression>
    {
    }
}