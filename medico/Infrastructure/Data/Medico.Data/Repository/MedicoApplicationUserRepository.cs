using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicoApplicationUserRepository
        : Repository<MedicoApplicationUser>, IMedicoApplicationUserRepository
    {
        public MedicoApplicationUserRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
