using System.Threading.Tasks;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChart;
using Medico.Application.ViewModels.PatientChartDocument;

namespace Medico.Application.Interfaces
{
    public interface  IPatientChartService
    {
        Task<PatientChartNode> GetByFilter(PatientChartDocumentFilterVm searchFilterVm);

        Task<PatientChartNode> Update(PatientChartVm patientChartVm);
    }
}
