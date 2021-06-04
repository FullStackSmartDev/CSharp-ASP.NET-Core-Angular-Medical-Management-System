using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class AllegationsNotesStatusRepository
        : Repository<AllegationsNotesStatus>, IAllegationsNotesStatusRepository
    {
        public AllegationsNotesStatusRepository(MedicoContext context) : base(context)
        {
        }
    }
}
