using System;

namespace Medico.Domain.Models
{
    public class BaseMedicalHistory : Entity
    {
        public string Notes { get; set; }

        public Patient Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime? CreateDate { get; set; }

        public string Diagnosis { get; set; }
    }
}
