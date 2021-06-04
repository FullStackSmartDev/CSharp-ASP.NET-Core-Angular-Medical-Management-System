using System;

namespace Medico.Application.ViewModels
{
    public class MedicationItemInfoViewModel
    {
        public Guid MedicationNameId { get; set; }

        public string[] RouteList { get; set; }

        public string[] StrengthList { get; set; }

        public string[] UnitList { get; set; }

        public string[] DosageFormList { get; set; }
    }
}
