using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class DrugHistoryRepository
        : Repository<DrugHistory>, IDrugHistoryRepository
    {
        public DrugHistoryRepository(MedicoContext context) : base(context)
        {
        }
    }
}
