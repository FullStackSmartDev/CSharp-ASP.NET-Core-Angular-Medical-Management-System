using System;

namespace Medico.Application.ViewModels.TemplateType
{
    public class TemplateTypeSearchFilterVm : SearchFilterVm
    {
        public string Name { get; set; }

        public Guid? TemplateId { get; set; }
    }
}