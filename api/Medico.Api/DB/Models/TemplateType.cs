
using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class TemplateType : BaseActiveEntity
    {
        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public List<Template> Templates { get; set; }
    }
}
