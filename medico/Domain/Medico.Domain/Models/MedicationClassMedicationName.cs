using System;

namespace Medico.Domain.Models
{
    public class MedicationClassMedicationName
    {
        public Guid MedicationClassId { get; set; }

        public MedicationClass MedicationClass { get; set; }

        public Guid MedicationNameId { get; set; }

        public MedicationName MedicationName { get; set; }
    }
}