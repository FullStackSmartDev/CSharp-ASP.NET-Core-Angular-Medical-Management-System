using DevExtreme.AspNet.Data;

namespace Medico.Application.Interfaces
{
    public interface IDataSourceLoadOptionsHelper
    {
        string GetSearchString(DataSourceLoadOptionsBase loadOptions);
    }
}
