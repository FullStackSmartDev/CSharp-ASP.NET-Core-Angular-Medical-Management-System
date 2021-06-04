using System.Threading.Tasks;
using Medico.Application.Services.PatientChart;

namespace Medico.Application.Services
{
    public interface IDefaultValueProvider
    {
        PatientChartNodeType Key { get; }

        Task<string> GetValue();
    }
}