using System;

namespace Medico.Domain.Models
{
    public class MedicationHistory : Entity
    {
        public DateTime? CreateDate { get; set; }
        public string Medication { get; set; }
        public Guid? MedicationNameId { get; set; }
        public MedicationName MedicationName { get; set; }
        public Patient Patient { get; set; }
        public Guid PatientId { get; set; }
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