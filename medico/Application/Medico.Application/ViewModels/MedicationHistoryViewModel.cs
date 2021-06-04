using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class MedicationHistoryViewModel : BaseViewModel
    {
        public DateTime? CreateDate { get; set; }

        [Required] public string Medication { get; set; }
        [Required] public Guid PatientId { get; set; }

        public Guid? MedicationNameId { get; set; }

        public string Dose { get; set; }

        public string Units { get; set; }

        public string DosageForm { get; set; }

        public string Route { get; set; }
        
        public string Sig { get; set; }
        public bool? Prn { get; set; }
        public string MedicationStatus { get; set; }

        public string Notes { get; set; }
    }
}