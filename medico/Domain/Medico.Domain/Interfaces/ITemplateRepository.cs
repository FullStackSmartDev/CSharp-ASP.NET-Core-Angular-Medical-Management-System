using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface ITemplateRepository 
        : IDeletableByIdRepository<Template>
    {
    }
}
