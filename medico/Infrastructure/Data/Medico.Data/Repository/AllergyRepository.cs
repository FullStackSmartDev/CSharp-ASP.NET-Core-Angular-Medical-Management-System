using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class AllergyRepository : Repository<Allergy>, IAllergyRepository
    {
        public AllergyRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
