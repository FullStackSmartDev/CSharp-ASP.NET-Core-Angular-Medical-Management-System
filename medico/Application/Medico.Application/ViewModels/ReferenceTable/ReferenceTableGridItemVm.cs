using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.ReferenceTable
{
    public class ReferenceTableGridItemVm : BaseViewModel
    {
        public Guid? LibraryReferenceTableId { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        [Required]
        public string Title { get; set; }
    }
}