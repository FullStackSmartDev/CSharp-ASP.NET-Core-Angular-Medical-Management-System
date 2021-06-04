using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class MedicalRecordViewModel : BaseViewModel
    {
        public string Notes { get; set; }

        [Required]
        public string DocumentType { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }
        
        [Required]
        public bool IncludeNotesInReport { get; set; }
    }
}
