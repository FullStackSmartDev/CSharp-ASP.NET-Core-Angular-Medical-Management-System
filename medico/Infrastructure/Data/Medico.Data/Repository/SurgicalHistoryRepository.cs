using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class SurgicalHistoryRepository : Repository<SurgicalHistory>, ISurgicalHistoryRepository
    {
        public SurgicalHistoryRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
