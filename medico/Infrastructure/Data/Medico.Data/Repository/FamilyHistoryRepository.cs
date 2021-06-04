using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class FamilyHistoryRepository
        : Repository<FamilyHistory>, IFamilyHistoryRepository
    {
        public FamilyHistoryRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
