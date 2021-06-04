using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class AppointmentViewModel : BaseViewModel
    {
        [Required]
        public Guid PatientId { get; set; }

        [Required]
        public Guid CompanyId { get; set; }

        [Required]
        public Guid LocationId { get; set; }

        [Required]
        public Guid PhysicianId { get; set; }

        [Required]
        public Guid NurseId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public Guid? AdmissionId { get; set; }
        
        public Guid? PatientChartDocumentId { get; set; }

        public string Allegations { get; set; }

        public string AllegationsNotes { get; set; }

        public string AppointmentStatus { get; set; }
    }
}