using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicalRecordRepository
        : Repository<MedicalRecord>, IMedicalRecordRepository
    {
        public MedicalRecordRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
