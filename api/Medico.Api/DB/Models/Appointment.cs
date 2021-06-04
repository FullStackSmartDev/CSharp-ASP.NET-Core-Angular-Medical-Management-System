using System;

namespace Medico.Api.DB.Models
{
    public class Appointment : CompanyRelatedEntity
    {
        public Guid LocationId { get; set; }

        public Guid PatientDemographicId { get; set; }

        public Guid PhysicianId { get; set; }

        public Guid NurseId { get; set; }

        public Guid RoomId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string AppointmentStatus { get; set; }

        public PatientDemographic PatientDemographic { get; set; }

        public Room Room { get; set; }

        public Admission Admission { get; set; }

        public Location Location { get; set; }

        public Guid? AdmissionId { get; set; }

        public string Allegations { get; set; }
    }
}
