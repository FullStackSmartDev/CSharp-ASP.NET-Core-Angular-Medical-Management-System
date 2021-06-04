using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class MedicationClass : Entity
    {
        public string ClassName { get; set; }

        public List<MedicationClassMedicationName> MedicationNames { get; set; }

        public List<Allergy> Allergies { get; set; }
    }
}