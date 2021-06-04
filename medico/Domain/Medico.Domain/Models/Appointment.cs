using System;

namespace Medico.Domain.Models
{
    public class Appointment : Entity
    {
        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public Guid CompanyId { get; set; }

        public Company Company { get; set; }

        public Guid LocationId { get; set; }

        public Location Location { get; set; }

        public Guid PhysicianId { get; set; }

        public Guid NurseId { get; set; }

        public Guid RoomId { get; set; }

        public Room Room { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public Admission Admission { get; set; }

        public Guid? AdmissionId { get; set; }

        public PatientChartDocumentNode PatientChartDocument { get; set; }
        
        public Guid? PatientChartDocumentId { get; set; }

        public string Allegations { get; set; }

        public string AllegationsNotes { get; set; }

        public string AppointmentStatus { get; set; }
    }
}