using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IPatientInsuranceRepository
        : IDeletableByIdRepository<PatientInsurance>
    {
    }
}