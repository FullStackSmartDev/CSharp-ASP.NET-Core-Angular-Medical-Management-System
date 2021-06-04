using System;

namespace Medico.Api.DB.Models
{
    public class MedicationHistory : BaseEntity
    {
        public DateTime CreatedDate { get; set; }

        public string Medication { get; set; }

        public PatientDemographic Patient { get; set; }

        public Guid PatientId { get; set; }

        public int? Dose { get; set; }

        public string Units { get; set; }

        public string DoseSchedule { get; set; }

        public string Route { get; set; }

        public bool? Prn { get; set; }

        public string MedicationStatus { get; set; }

        public string Notes { get; set; }
    }
}
