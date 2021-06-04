using System;

namespace Medico.Application.ViewModels.Template
{
    public class TemplateSearchFilterVm : SearchFilterVm
    {
        public Guid? TemplateTypeId { get; set; }
        
        public Guid? ChiefComplaintId { get; set; }

        public Guid? SelectableListId { get; set; }

        public bool? ExcludeImported { get; set; }

        public bool? IsRequired { get; set; }
        
        
        public Guid? ExpressionId { get; set; }
    }
}