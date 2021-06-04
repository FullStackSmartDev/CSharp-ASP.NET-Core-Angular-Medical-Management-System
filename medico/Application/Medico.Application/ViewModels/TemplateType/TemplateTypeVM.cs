using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.TemplateType
{
    public class TemplateTypeVm : BaseActiveViewModel
    {
        public Guid? CompanyId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Title { get; set; }

        public Guid? LibraryTemplateTypeId { get; set; }

        [Required]
        public bool IsPredefined { get; set; }
    }
}
