using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationItemInfoViewRepository
        : ViewRepository<MedicationItemInfoView>, IMedicationItemInfoViewRepository
    {
        public MedicationItemInfoViewRepository(MedicoContext context) : base(context)
        {
        }
    }
}
