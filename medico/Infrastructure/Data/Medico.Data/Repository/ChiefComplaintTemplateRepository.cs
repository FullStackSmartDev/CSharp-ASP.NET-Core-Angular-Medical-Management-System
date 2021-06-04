using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ChiefComplaintTemplateRepository
        : Repository<ChiefComplaintTemplate>, IChiefComplaintTemplateRepository
    {
        public ChiefComplaintTemplateRepository(MedicoContext context) : base(context)
        {
        }
    }
}
