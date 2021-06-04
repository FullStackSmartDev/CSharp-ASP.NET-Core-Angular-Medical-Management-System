using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class Template : Entity
    {
        public Guid? LibraryTemplateId { get; set; }

        public Template LibraryTemplate { get; set; }

        public int? Version { get; set; }

        public bool IsActive { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public int? TemplateOrder { get; set; }

        public string Title { get; set; }

        public string ReportTitle { get; set; }

        public string DetailedTemplateHtml { get; set; }

        public string InitialDetailedTemplateHtml { get; set; }

        public string DefaultTemplateHtml { get; set; }

        public bool IsRequired { get; set; }

        public bool IsHistorical { get; set; }

        public Guid TemplateTypeId { get; set; }

        public TemplateType TemplateType { get; set; }

        public List<ChiefComplaintTemplate> ChiefComplaintTemplates { get; set; }

        public List<Template> LibraryRelatedTemplates { get; set; }

        public List<TemplateSelectableList> TemplateSelectableLists { get; set; }
        
        public List<TemplateExpression> TemplateExpressions { get; set; }
    }
}