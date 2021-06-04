using System;

namespace Medico.Api.DB.Models
{
    public class TemplateLookupItem : BaseActiveEntity
    {
        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Name { get; set; }

        public string JsonValues { get; set; }

        public TemplateLookupItemCategory TemplateLookupItemCategory { get; set; }

        public Guid TemplateLookupItemCategoryId { get; set; }

        public string Title { get; set; }
    }
}
