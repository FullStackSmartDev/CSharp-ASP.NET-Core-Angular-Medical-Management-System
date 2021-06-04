using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class CategorySelectableListViewRepository
        : ViewRepository<CategorySelectableList>, ICategorySelectableListViewRepository
    {
        public CategorySelectableListViewRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
