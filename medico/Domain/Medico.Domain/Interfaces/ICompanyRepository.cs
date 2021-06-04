using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface ICompanyRepository
        : IDeletableByIdRepository<Company>
    {
    }
}
