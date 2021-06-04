using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Template : BaseActiveEntity
    {
        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public int? TemplateOrder { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public string ReportTitle { get; set; }

        public string Value { get; set; }

        public string DetailedTemplateHtml { get; set; }

        public string DefaultTemplateHtml { get; set; }

        public bool IsRequired { get; set; }

        public bool? IsHistorical { get; set; }

        public Guid TemplateTypeId { get; set; }

        public TemplateType TemplateType { get; set; }

        public List<ChiefComplaintTemplate> ChiefComplaints { get; set; }
    }
}
