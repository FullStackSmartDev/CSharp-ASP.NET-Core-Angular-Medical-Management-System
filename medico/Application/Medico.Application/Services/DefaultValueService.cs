using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;

namespace Medico.Application.Services
{
    public class DefaultValueService : IDefaultValueService
    {
        private readonly IEnumerable<IDefaultValueProvider> _defaultValueProviders;

        public DefaultValueService(IEnumerable<IDefaultValueProvider> defaultValueProviders)
        {
            _defaultValueProviders = defaultValueProviders;
        }

        public async Task<DefaultValueViewModel> GetPatientChartNodeType(PatientChartNodeType patientChartNodeType)
        {
            var defaultValueProvider = _defaultValueProviders
                .FirstOrDefault(p => p.Key == patientChartNodeType);

            var defaultValueViewModel = new DefaultValueViewModel();

            if (defaultValueProvider != null)
                defaultValueViewModel.Value = await defaultValueProvider.GetValue();

            return defaultValueViewModel;
        }
    }
}
