using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class NdcCodeRepository : Repository<NdcCode>, INdcCodeRepository
    {
        public NdcCodeRepository(MedicoContext context) : base(context)
        {
        }
    }
}
