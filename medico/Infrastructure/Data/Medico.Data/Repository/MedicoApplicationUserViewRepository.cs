using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicoApplicationUserViewRepository
        : ViewRepository<MedicoApplicationUserView>, IMedicoApplicationUserViewRepository
    {
        public MedicoApplicationUserViewRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
