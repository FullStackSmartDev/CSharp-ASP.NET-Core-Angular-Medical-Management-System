using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IVitalSignsRepository
        : IDeletableByIdRepository<VitalSigns>
    {
    }
}