using System;

namespace Medico.Api.DB.Models
{
    public class EducationHistory : BaseEntity
    {
        public PatientDemographic Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Degree { get; set; }

        public int? YearCompleted { get; set; }

        public string Notes { get; set; }
    }
}
