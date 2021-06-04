using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationClassMedicationNameRepository : Repository<MedicationClassMedicationName>,
        IMedicationClassMedicationNameRepository
    {
        public MedicationClassMedicationNameRepository(MedicoContext context) : base(context)
        {
        }
    }
}
