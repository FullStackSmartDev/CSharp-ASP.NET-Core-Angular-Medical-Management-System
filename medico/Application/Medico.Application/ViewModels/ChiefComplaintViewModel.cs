using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class ChiefComplaintViewModel :BaseViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public Guid CompanyId { get; set; }
    }
}
