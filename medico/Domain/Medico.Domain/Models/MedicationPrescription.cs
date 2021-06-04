using System;

namespace Medico.Domain.Models
{
    public class MedicationPrescription : Entity
    {
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public Guid AdmissionId { get; set; }
        public Admission Admission { get; set; }
        public Guid? MedicationNameId { get; set; }
        public MedicationName MedicationName { get; set; }
        public string Medication { get; set; }
        public string Dose { get; set; }
        public string DosageForm { get; set; }
        public string Route { get; set; }
        public string Units { get; set; }
        public int Dispense { get; set; }
        public int Refills { get; set; }
        public string Sig { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}