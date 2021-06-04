using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class DocumentRepository : Repository<Document>, IDocumentRepository
    {
        public DocumentRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
