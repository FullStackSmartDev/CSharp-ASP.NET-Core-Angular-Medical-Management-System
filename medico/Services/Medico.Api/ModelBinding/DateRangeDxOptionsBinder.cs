using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class DateRangeDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var dateRangeLoadOptions = new DateRangeDxOptionsViewModel();

            dateRangeLoadOptions.EndDate = 
                ExtractDate(bindingContext, nameof(dateRangeLoadOptions.EndDate));

            dateRangeLoadOptions.StartDate =
                ExtractDate(bindingContext, nameof(dateRangeLoadOptions.StartDate));

            dateRangeLoadOptions.CompanyId = 
                ExtractGuid(bindingContext, nameof(dateRangeLoadOptions.CompanyId));

            return dateRangeLoadOptions;
        }
    }
}
