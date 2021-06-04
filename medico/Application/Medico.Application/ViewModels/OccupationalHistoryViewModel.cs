using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class OccupationalHistoryViewModel : BaseViewModel
    {
        [Required]
        public string OccupationalType { get; set; }
        
        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public string DisabilityClaimDetails { get; set; }

        public string WorkersCompensationClaimDetails { get; set; }
        
        public string EmploymentStatus { get; set; }

        public string Notes { get; set; }

        [Required]
        public Guid PatientId { get; set; }
        
        public DateTime? CreateDate { get; set; }
    }
}
