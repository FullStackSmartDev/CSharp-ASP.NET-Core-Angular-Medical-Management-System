using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class AdmissionRepository: Repository<Admission>, IAdmissionRepository
    {
        public AdmissionRepository(MedicoContext context) 
            : base(context)
        {
        }
    }
}
