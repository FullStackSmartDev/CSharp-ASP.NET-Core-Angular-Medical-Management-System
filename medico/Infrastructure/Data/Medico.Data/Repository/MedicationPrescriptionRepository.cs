using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationPrescriptionRepository
        : Repository<MedicationPrescription>, IMedicationPrescriptionRepository
    {
        public MedicationPrescriptionRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
