using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class IcdCodeRepository : Repository<IcdCode>, IIcdCodeRepository
    {
        public IcdCodeRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}