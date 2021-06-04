using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IDocumentRepository
        : IDeletableByIdRepository<Document>
    {
    }
}
