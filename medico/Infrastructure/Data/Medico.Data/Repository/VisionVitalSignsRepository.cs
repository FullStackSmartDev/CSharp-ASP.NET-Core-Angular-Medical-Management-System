using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class VisionVitalSignsRepository :Repository<VisionVitalSigns>, IVisionVitalSignsRepository
    {
        public VisionVitalSignsRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
