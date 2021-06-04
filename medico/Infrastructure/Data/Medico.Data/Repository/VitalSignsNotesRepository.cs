using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class VitalSignsNotesRepository
        : Repository<VitalSignsNotes>, IVitalSignsNotesRepository
    {
        public VitalSignsNotesRepository(MedicoContext context) : base(context)
        {
        }
    }
}
