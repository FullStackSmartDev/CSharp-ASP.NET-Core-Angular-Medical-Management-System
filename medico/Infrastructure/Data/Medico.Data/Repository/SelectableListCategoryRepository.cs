using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class SelectableListCategoryRepository
        : Repository<SelectableListCategory>, ISelectableListCategoryRepository
    {
        public SelectableListCategoryRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
