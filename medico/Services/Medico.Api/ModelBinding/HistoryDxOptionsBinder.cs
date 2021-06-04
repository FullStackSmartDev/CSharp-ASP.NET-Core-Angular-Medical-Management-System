using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class HistoryDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var historyLoadOptions = new HistoryDxOptionsViewModel();

            historyLoadOptions.PatientId = ExtractGuid(bindingContext,
                nameof(historyLoadOptions.PatientId));

            return historyLoadOptions;
        }
    }
}
