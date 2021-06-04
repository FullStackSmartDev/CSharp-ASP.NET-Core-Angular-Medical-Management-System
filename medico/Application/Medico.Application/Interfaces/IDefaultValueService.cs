using System.Threading.Tasks;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IDefaultValueService
    {
        Task<DefaultValueViewModel> GetPatientChartNodeType(PatientChartNodeType patientChartNodeType);
    }
}