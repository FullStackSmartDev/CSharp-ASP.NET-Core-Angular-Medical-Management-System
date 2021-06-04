using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class EducationHistoryRepository 
        : Repository<EducationHistory>, IEducationHistoryRepository
    {
        public EducationHistoryRepository(MedicoContext context) : base(context)
        {
        }
    }
}