using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class VitalSignsViewModel : BaseViewModel
    {
        public Guid? AdmissionId { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        public double? Pulse { get; set; }

        public double? SystolicBloodPressure { get; set; }

        public double? DiastolicBloodPressure { get; set; }

        public string BloodPressurePosition { get; set; }

        public string BloodPressureLocation { get; set; }

        public string OxygenSaturationAtRest { get; set; }

        public double? OxygenSaturationAtRestValue { get; set; }

        public int? RespirationRate { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }
    }
}