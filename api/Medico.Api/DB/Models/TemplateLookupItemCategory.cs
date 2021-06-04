using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class TemplateLookupItemCategory : BaseActiveEntity
    {
        public string Name { get; set; }

        public List<TemplateLookupItem> TemplateLookupItems { get; set; }

        public string Title { get; set; }
    }
}