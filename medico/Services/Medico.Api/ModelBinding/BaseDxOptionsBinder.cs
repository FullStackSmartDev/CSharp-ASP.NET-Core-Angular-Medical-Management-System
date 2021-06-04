using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.Helpers;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public abstract class BaseDxOptionsBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var loadOptions = GetLoadOptions(bindingContext);

            DataSourceLoadOptionsParser.Parse(loadOptions, key =>
                bindingContext.ValueProvider.GetValue(key).FirstOrDefault());

            bindingContext.Result = ModelBindingResult.Success(loadOptions);
            return Task.CompletedTask;
        }

        protected abstract DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext);

        protected T GetUrlParameterValue<T>(ModelBindingContext bindingContext,
            string propertyName, Func<string, T> stringValueConverterFunc)
        {
            var urlParameterName =
                $"{propertyName.First().ToString().ToLower(CultureInfo.InvariantCulture)}{propertyName.Substring(1)}";

            var urlParameterValue = bindingContext.HttpContext
                .Request.Query.FirstOrDefault(i => i.Key == urlParameterName)
                .Value;

            return urlParameterValue.Count != 0
                ? stringValueConverterFunc(urlParameterValue)
                : default(T);
        }

        protected DateTime ExtractDate(ModelBindingContext bindingContext, string propertyName)
        {
            return GetUrlParameterValue(bindingContext, propertyName,
                parameterStringValue => DateTime.Parse(parameterStringValue)
                    .ToUniversalTime());
        }

        protected Guid ExtractGuid(ModelBindingContext bindingContext, string propertyName)
        {
            return GetUrlParameterValue(bindingContext, propertyName, Guid.Parse);
        }
    }
}