using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class AllergyViewModel : BaseViewModel
    {
        [Required]
        public string Reaction { get; set; }

        [Required]
        public string Medication { get; set; }

        public string Notes { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        public Guid? MedicationNameId { get; set; }

        public Guid? MedicationClassId { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }
    }
}
