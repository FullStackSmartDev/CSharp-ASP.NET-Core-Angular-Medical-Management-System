using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.SelectableListCategory
{
    public class SelectableListCategoryVm : BaseActiveViewModel
    {
        public Guid? CompanyId { get; set; }

        [Required]
        public string Title { get; set; }
    }
}
