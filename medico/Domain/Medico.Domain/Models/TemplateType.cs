using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class TemplateType : Entity
    {
        public Guid? LibraryTemplateTypeId { get; set; }

        public TemplateType LibraryTemplateType { get; set; }

        public bool IsActive { get; set; }

        public bool IsPredefined { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public List<Template> Templates { get; set; }

        public List<TemplateType> LibraryRelatedTemplateTypes { get; set; }
    }
}
