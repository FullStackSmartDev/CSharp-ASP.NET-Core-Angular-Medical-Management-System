using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ExpressionRepository : Repository<Expression>, IExpressionRepository
    {
        public ExpressionRepository(MedicoContext context) : base(context)
        {
        }
    }
}