using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationNameRepository :
        Repository<MedicationName>, IMedicationNameRepository
    {
        public MedicationNameRepository(MedicoContext context) : base(context)
        {
        }
    }
}