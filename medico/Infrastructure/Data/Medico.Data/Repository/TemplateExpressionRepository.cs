using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class TemplateExpressionRepository
        : Repository<TemplateExpression>, ITemplateExpressionRepository
    {
        public TemplateExpressionRepository(MedicoContext context) : base(context)
        {
        }
    }
}