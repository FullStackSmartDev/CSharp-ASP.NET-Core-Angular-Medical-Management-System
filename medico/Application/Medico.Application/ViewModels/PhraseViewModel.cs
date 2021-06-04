using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class PhraseViewModel : BaseViewModel
    {
        [Required]
        public bool IsActive { get; set; }

        [Required]
        public Guid CompanyId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public string ContentWithDefaultSelectableItemsValues { get; set; }
    }
}