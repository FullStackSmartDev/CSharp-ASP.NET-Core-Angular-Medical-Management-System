using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationItemInfoRepository :
        Repository<MedicationItemInfo>, IMedicationItemInfoRepository
    {
        public MedicationItemInfoRepository(MedicoContext context) : base(context)
        {
        }
    }
}