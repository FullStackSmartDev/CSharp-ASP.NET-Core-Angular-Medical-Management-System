using System;

namespace Medico.Api.DB.Models
{
    public class BaseMedicalHistory : BaseEntity
    {
        public string Notes { get; set; }

        public PatientDemographic Patient { get; set; }

        public Guid PatientId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Diagnosis { get; set; }
    }

    public class MedicalHistory : BaseMedicalHistory
    {
        //IcdCode
    }

    public class SurgicalHistory : BaseMedicalHistory
    {
        //CptCode
    }

    public class MedicalRecord : BaseMedicalHistory
    {
    }
}