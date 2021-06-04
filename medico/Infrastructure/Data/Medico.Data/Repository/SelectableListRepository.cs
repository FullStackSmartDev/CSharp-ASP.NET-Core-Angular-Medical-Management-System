using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class SelectableListRepository
        : Repository<SelectableList>, ISelectableListRepository
    {
        public SelectableListRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
