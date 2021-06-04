using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class PatientChartDocumentNodeRepository
        : Repository<PatientChartDocumentNode>, IPatientChartDocumentNodeRepository
    {
        public PatientChartDocumentNodeRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
