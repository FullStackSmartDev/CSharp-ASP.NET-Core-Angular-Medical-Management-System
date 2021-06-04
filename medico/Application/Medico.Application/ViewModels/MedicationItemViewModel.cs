using System;

namespace Medico.Application.ViewModels
{
    public class MedicationItemViewModel
    {
        public Guid MedicationNameId { get; set; }

        public string Route { get; set; }

        public string Strength { get; set; }

        public string Unit { get; set; }

        public string DosageForm { get; set; }
    }
}
