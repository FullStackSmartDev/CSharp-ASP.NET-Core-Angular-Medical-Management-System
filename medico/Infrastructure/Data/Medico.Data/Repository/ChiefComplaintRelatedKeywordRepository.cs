using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ChiefComplaintRelatedKeywordRepository
        : Repository<ChiefComplaintRelatedKeyword>, IChiefComplaintRelatedKeywordRepository
    {
        public ChiefComplaintRelatedKeywordRepository(MedicoContext context) : base(context)
        {
        }
    }
}
