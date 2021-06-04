using System;

namespace Medico.Api.DB.Models
{
    public class EntityExtraFieldMap
    {
        public Guid EntityId { get; set; }

        public Guid ExtraFieldId { get; set; }

        public string Value { get; set; }
    }
}