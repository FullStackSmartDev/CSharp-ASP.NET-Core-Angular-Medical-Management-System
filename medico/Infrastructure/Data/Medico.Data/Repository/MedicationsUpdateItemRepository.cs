using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationsUpdateItemRepository : Repository<MedicationsUpdateItem>,
        IMedicationsUpdateItemRepository
    {
        public MedicationsUpdateItemRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
