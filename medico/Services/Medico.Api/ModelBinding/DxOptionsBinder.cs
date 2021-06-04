using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class DxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            return new DxOptionsViewModel();
        }
    }
}
