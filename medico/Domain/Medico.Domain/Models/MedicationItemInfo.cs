using System;

namespace Medico.Domain.Models
{
    public class MedicationItemInfo
    {
        public Guid MedicationNameId { get; set; }

        public MedicationName MedicationName { get; set; }

        public string Route { get; set; }

        public string Strength { get; set; }

        public string Unit { get; set; }

        public string DosageForm { get; set; }
    }
}