using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class ReferenceTableRepository 
        : Repository<ReferenceTable>, IReferenceTableRepository
    {
        public ReferenceTableRepository(MedicoContext context) : base(context)
        {
        }
    }
}