using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class TemplateTypeRepository 
        : Repository<TemplateType>, ITemplateTypeRepository
    {
        public TemplateTypeRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
