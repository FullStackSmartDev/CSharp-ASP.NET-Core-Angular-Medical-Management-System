using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IPatientRepository
        : IDeletableByIdRepository<Patient>
    {
    }
}