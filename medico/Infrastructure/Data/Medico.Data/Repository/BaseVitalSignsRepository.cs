using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class BaseVitalSignsRepository : Repository<BaseVitalSigns>, IBaseVitalSignsRepository
    {
        public BaseVitalSignsRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}