using System;

namespace Medico.Domain.Models
{
    public class MedicationItemInfoView
    {
        public Guid MedicationNameId { get; set; }

        public string Routes { get; set; }

        public string Strength { get; set; }

        public string Units { get; set; }

        public string DosageForms { get; set; }
    }
}