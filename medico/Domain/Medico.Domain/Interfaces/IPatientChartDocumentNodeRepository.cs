using Medico.Domain.Models;

namespace Medico.Domain.Interfaces
{
    public interface IPatientChartDocumentNodeRepository
        : IDeletableByIdRepository<PatientChartDocumentNode>
    {
    }
}
