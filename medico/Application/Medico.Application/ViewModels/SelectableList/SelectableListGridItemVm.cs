using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.SelectableList
{
    public class SelectableListGridItemVm : BaseActiveViewModel
    {
        public Guid? CompanyId { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public string Title { get; set; }

        public Guid? LibrarySelectableListId { get; set; }

        public int? Version { get; set; }

        public bool IsPredefined { get; set; }
    }
}