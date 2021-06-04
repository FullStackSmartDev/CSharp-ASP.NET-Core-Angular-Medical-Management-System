using System;

namespace Medico.Api.DB.Models
{
    public class LookupItem : BaseEntity
    {
        public LookupItemCollection LookupItemCollection { get; set; }

        public Guid LookupItemCollectionId { get; set; }

        public string Value { get; set; }
    }
}