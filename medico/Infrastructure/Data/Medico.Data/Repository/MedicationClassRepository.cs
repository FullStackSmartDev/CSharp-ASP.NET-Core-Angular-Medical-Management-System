using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationClassRepository
        : Repository<MedicationClass>, IMedicationClassRepository
    {
        public MedicationClassRepository(MedicoContext context) : base(context)
        {
        }
    }
}
