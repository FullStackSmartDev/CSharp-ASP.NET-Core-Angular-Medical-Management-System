using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class PatientInsuranceRepository
        : Repository<PatientInsurance>, IPatientInsuranceRepository
    {
        public PatientInsuranceRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}