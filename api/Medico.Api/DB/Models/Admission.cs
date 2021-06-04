using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Admission : BaseEntity
    {
        public Guid PatientDemographicId { get; set; }

        public Guid AppointmentId { get; set; }

        public Appointment Appointment { get; set; }

        public Guid? SignatureInfoId { get; set; }

        public SignatureInfo SignatureInfo { get; set; }

        public PatientDemographic PatientDemographic { get; set; }

        public string AdmissionData { get; set; }
        
        public DateTime CreatedDate { get; set; }

        public List<VitalSigns> VitalSigns { get; set; }
            
        public List<Addendum> Addendums { get; set; }
    }
}
