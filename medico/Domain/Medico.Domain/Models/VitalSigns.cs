using System;

namespace Medico.Domain.Models
{
    public class VitalSigns : Entity
    {
        public Guid? AdmissionId { get; set; }

        public Admission Admission { get; set; }

        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public double? Pulse { get; set; }

        public double? SystolicBloodPressure { get; set; }

        public double? DiastolicBloodPressure { get; set; }

        public string BloodPressurePosition { get; set; }

        public string BloodPressureLocation { get; set; }

        public string OxygenSaturationAtRest { get; set; }

        public double? OxygenSaturationAtRestValue { get; set; }

        public int? RespirationRate { get; set; }

        public DateTime CreateDate { get; set; }
    }
}