using System;

namespace Medico.Domain.Models
{
    public class EducationHistory : Entity
    {
        public Patient Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime? CreateDate { get; set; }

        public string Degree { get; set; }

        public int? YearCompleted { get; set; }

        public string Notes { get; set; }
    }
}
