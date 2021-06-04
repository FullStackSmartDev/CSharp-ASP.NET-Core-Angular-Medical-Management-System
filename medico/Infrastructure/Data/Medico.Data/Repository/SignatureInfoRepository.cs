using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class SignatureInfoRepository : Repository<SignatureInfo>, ISignatureInfoRepository
    {
        public SignatureInfoRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
