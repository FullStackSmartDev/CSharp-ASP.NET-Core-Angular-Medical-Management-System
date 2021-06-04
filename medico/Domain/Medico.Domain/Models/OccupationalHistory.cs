using System;

namespace Medico.Domain.Models
{
    public class OccupationalHistory : Entity
    {
        public string OccupationalType { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public string DisabilityClaimDetails { get; set; }

        public string WorkersCompensationClaimDetails { get; set; }

        public string EmploymentStatus { get; set; }

        public string Notes { get; set; }

        public Patient Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime? CreateDate { get; set; }
    }
}