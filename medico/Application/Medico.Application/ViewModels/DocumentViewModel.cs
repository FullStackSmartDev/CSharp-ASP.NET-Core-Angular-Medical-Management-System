using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class DocumentViewModel : BaseViewModel
    {
        [Required]
        public Guid PatientId { get; set; }

        [Required]
        public string DocumentData { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }
    }
}
