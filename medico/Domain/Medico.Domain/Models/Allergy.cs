using System;

namespace Medico.Domain.Models
{
    public class Allergy : Entity
    {
        public string Reaction { get; set; }

        public string Medication { get; set; }

        public string Notes { get; set; }

        public Guid? MedicationNameId { get; set; }

        public MedicationName MedicationName { get; set; }

        public Guid? MedicationClassId { get; set; }

        public MedicationClass MedicationClass { get; set; }

        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public DateTime CreateDate { get; set; }
    }
}
