using System;

namespace Medico.Api.DB.Models
{
    public class OccupationalHistory : BaseEntity
    {
        public string OccupationalType { get; set; }

        public DateTime Start { get; set; }

        public DateTime? End { get; set; }

        public string DisabilityClaimDetails { get; set; }

        public string WorkersCompensationClaimDetails { get; set; }

        public string EmploymentStatus { get; set; }

        public string Notes { get; set; }

        public PatientDemographic Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
