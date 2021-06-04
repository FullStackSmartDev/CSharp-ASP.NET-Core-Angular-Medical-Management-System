using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class MedicationPrescriptionViewModel : BaseViewModel
    {
        [Required]
        public Guid PatientId { get; set; }

        [Required]
        public Guid AdmissionId { get; set; }

        public Guid? MedicationNameId { get; set; }

        [Required]
        public string Medication { get; set; }

        [Required]
        public string Dose { get; set; }

        [Required]
        public string DosageForm { get; set; }

        [Required]
        public string Route { get; set; }

        [Required]
        public string Units { get; set; }

        public int Dispense { get; set; }

        public int Refills { get; set; }

        public string Sig { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }
}
