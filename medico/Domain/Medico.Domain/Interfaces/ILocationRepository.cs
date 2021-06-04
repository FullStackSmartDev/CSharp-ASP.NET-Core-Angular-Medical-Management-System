using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface ILocationRepository
        : IDeletableByIdRepository<Location>
    {
    }
}
