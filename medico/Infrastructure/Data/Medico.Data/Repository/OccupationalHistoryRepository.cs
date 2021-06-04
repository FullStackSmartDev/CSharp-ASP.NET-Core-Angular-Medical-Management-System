using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class OccupationalHistoryRepository
        : Repository<OccupationalHistory>, IOccupationalHistoryRepository
    {
        public OccupationalHistoryRepository(MedicoContext context) : base(context)
        {
        }
    }
}
