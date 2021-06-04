using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class MedicationName : Entity
    {
        public string Name { get; set; }

        public List<MedicationClassMedicationName> MedicationClasses { get; set; }

        public List<MedicationItemInfo> MedicationItems { get; set; }

        public List<MedicationPrescription> MedicationPrescriptions { get; set; }

        public List<Allergy> Allergies { get; set; }

        public List<MedicationHistory> MedicationHistory { get; set; }
    }
}