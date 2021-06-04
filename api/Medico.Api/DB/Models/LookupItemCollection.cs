using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class LookupItemCollection : BaseEntity
    {
        public string Name { get; set; }

        public List<LookupItem> LookupItems { get; set; }
    }
}
