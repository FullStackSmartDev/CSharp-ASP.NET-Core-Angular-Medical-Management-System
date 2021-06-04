using System;

namespace Medico.Api.DB.Models
{
    public class TemplateLookupItemTracker
    {
        public Guid TemplateId { get; set; }

        public Guid TemplateLookupItemId { get; set; }

        public int NumberOfLookupItemsInTemplate { get; set; }
    }
}
