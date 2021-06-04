using System;

namespace Medico.Application.ViewModels.Template
{
    public class TemplateGridItemVm : BaseViewModel
    {
        public Guid? LibraryTemplateId { get; set; }

        public Guid? CompanyId { get; set; }

        public int? LibraryTemplateVersion { get; set; }

        public Guid TemplateTypeId { get; set; }

        public string TemplateTypeName { get; set; }

        public int? TemplateOrder { get; set; }

        public string ReportTitle { get; set; }

        public string Title { get; set; }

        public bool IsRequired { get; set; }

        public bool IsActive { get; set; }

        public bool IsHistorical { get; set; }

        public int? Version { get; set; }
    }
}