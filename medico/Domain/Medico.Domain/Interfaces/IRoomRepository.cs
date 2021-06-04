using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IRoomRepository
        : IDeletableByIdRepository<Room>
    {
    }
}