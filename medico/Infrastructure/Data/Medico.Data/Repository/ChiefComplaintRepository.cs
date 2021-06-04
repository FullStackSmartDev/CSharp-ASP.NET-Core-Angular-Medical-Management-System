using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ChiefComplaintRepository
        : Repository<ChiefComplaint>, IChiefComplaintRepository
    {
        public ChiefComplaintRepository(MedicoContext context) : base(context)
        {
        }
    }
}
