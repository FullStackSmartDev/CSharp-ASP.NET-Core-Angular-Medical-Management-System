using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class TobaccoHistoryRepository
        : Repository<TobaccoHistory>, ITobaccoHistoryRepository
    {
        public TobaccoHistoryRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
