using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class UserDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var userLoadOptions = new UserDxOptionsViewModel();

            userLoadOptions.StartDate = ExtractDate(bindingContext,
                nameof(userLoadOptions.StartDate));

            userLoadOptions.EndDate = ExtractDate(bindingContext,
                nameof(userLoadOptions.EndDate));

            userLoadOptions.EmployeeType = GetUrlParameterValue(bindingContext,
                nameof(userLoadOptions.EmployeeType), int.Parse);

            userLoadOptions.CompanyId = ExtractGuid(bindingContext,
                nameof(userLoadOptions.CompanyId));

            return userLoadOptions;
        }
    }
}
