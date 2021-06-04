using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class TemplateRepository : Repository<Template>, ITemplateRepository
    {
        public TemplateRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
