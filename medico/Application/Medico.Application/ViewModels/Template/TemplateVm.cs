using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.Template
{
    public class TemplateVm : BaseActiveViewModel
    {
        public Guid? CompanyId { get; set; }

        [Required]
        public string ReportTitle { get; set; }

        [Required]
        public string Title { get; set; }

        public int? TemplateOrder { get; set; }

        public string DetailedTemplateHtml { get; set; }

        public string DefaultTemplateHtml { get; set; }

        public string InitialDetailedTemplateHtml { get; set; }

        [Required]
        public bool IsRequired { get; set; }

        [Required]
        public bool IsHistorical { get; set; }

        [Required]
        public Guid TemplateTypeId { get; set; }

        public Guid? LibraryTemplateId { get; set; }

        public int? Version { get; set; }
    }
}
