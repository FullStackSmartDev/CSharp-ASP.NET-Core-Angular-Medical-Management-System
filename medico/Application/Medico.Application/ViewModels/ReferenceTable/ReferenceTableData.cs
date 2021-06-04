using Newtonsoft.Json.Linq;

namespace Medico.Application.ViewModels.ReferenceTable
{
    public class ReferenceTableData
    {
        public ReferenceTableHeaderColumn[] Header { get; set; }
        public JObject[] Body { get; set; }
    }
}