using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Newtonsoft.Json.Linq;

namespace Medico.Application.Services
{
    public class DataSourceLoadOptionsHelper : IDataSourceLoadOptionsHelper
    {
        public string GetSearchString(DataSourceLoadOptionsBase loadOptions)
        {
            var filters = loadOptions.Filter;

            var filter = filters?[0] as JArray;

            if (filter == null)
                return null;

            var searchString = filter[2] == null
                ? string.Empty
                : ((JValue)filter[2]).Value.ToString();

            return searchString;
        }
    }
}
