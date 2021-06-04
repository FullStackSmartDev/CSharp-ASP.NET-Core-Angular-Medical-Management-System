using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class IcdCodeChiefComplaintKeywordRepository
        : Repository<IcdCodeChiefComplaintKeyword>, IIcdCodeChiefComplaintKeywordRepository
    {
        public IcdCodeChiefComplaintKeywordRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
