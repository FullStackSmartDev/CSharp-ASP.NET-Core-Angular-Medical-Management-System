using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class CptCodeRepository : Repository<CptCode>, ICptCodeRepository
    {
        public CptCodeRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}