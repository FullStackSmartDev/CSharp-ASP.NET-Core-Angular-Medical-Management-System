using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationRepository : Repository<Medication>, IMedicationRepository
    {
        public MedicationRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
