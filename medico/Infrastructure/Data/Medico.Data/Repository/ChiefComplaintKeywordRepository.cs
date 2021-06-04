using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ChiefComplaintKeywordRepository
        : Repository<ChiefComplaintKeyword>, IChiefComplaintKeywordRepository
    {
        public ChiefComplaintKeywordRepository(MedicoContext context) : base(context)
        {
        }
    }
}
