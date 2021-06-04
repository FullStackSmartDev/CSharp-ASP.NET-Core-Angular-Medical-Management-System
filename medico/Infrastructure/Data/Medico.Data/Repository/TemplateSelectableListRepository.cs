using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class TemplateSelectableListRepository
        : Repository<TemplateSelectableList>, ITemplateSelectableListRepository
    {
        public TemplateSelectableListRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
