using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IMedicoApplicationUserRepository
        : IDeletableByIdRepository<MedicoApplicationUser>
    {
    }
}