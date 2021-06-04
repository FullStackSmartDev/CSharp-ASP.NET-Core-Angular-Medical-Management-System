using System;
using Medico.Domain.Interfaces;

namespace Medico.Domain.Models
{
    public class AppointmentGridItem : Entity, IIntervalEntity
    {
        public Guid CompanyId { get; set; }

        public Guid? AdmissionId { get; set; }

        public Guid? PatientChartDocumentId { get; set; }

        public string Allegations { get; set; }

        public string AllegationsNotes { get; set; }
        
        public DateTime StartDate { get; set; }

        public DateTime Date { get; set; }
        
        public DateTime EndDate { get; set; }

        public string AppointmentStatus { get; set; }
        
        public string LocationName { get; set; }
        
        public Guid LocationId { get; set; }

        public Guid RoomId { get; set; }

        public string RoomName { get; set; }
        
        public Guid PatientId { get; set; }
        
        public string PatientFirstName { get; set; }
        
        public string PatientLastName { get; set; }

        public DateTime PatientDateOfBirth { get; set; }
        
        public Guid PhysicianId { get; set; }
        
        public string PhysicianFirstName { get; set; }
        
        public string PhysicianLastName { get; set; }

        public Guid NurseId { get; set; }

        public string NurseFirstName { get; set; }

        public string NurseLastName { get; set; }

        public int TotalNumberOfPatientAppointments { get; set; }
        
        public DateTime? SigningDate { get; set; }
        
        public DateTime? PreviousAppointmentDate { get; set; }
    }
}