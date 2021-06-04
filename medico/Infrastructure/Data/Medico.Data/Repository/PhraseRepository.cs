using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class PhraseRepository
        : Repository<Phrase>, IPhraseRepository
    {
        public PhraseRepository(MedicoContext context) : base(context)
        {
        }
    }
}
