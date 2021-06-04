using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class VitalSignsRepository : Repository<VitalSigns>, IVitalSignsRepository
    {
        public VitalSignsRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
