using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ExpressionReferenceTableRepository 
        : Repository<ExpressionReferenceTable>, IExpressionReferenceTableRepository
    {
        public ExpressionReferenceTableRepository(MedicoContext context) : base(context)
        {
        }
    }
}