using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class AlcoholHistoryRepository
        : Repository<AlcoholHistory>, IAlcoholHistoryRepository
    {
        public AlcoholHistoryRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
