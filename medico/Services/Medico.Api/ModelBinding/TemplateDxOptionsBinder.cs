using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class TemplateDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var templateLoadOptions = new TemplateDxOptionsViewModel();

            templateLoadOptions.TemplateTypeId = ExtractGuid(bindingContext,
                nameof(templateLoadOptions.TemplateTypeId));

            templateLoadOptions.CompanyId = ExtractGuid(bindingContext,
                nameof(templateLoadOptions.CompanyId));

            return templateLoadOptions;
        }
    }
}