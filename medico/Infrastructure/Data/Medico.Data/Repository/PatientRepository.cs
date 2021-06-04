using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class PatientRepository
        : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
