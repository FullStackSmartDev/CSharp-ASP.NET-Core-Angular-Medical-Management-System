using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class CompanyDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var dateRangeLoadOptions = new CompanyDxOptionsViewModel();

            dateRangeLoadOptions.CompanyId =
                ExtractGuid(bindingContext, nameof(dateRangeLoadOptions.CompanyId));

            return dateRangeLoadOptions;
        }
    }
}