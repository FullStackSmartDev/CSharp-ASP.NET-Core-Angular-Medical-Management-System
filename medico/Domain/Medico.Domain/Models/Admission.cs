using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class Admission : Entity
    {
        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public Guid? VitalSignsNotesId { get; set; }

        public VitalSignsNotes VitalSignsNotes { get; set; }

        public Guid AppointmentId { get; set; }

        public Appointment Appointment { get; set; }

        public Guid? SignatureInfoId { get; set; }

        public SignatureInfo SignatureInfo { get; set; }

        public string AdmissionData { get; set; }

        public DateTime CreatedDate { get; set; }

        public List<VitalSigns> VitalSigns { get; set; }

        public List<MedicationPrescription> MedicationPrescriptions { get; set; }

        public AllegationsNotesStatus AllegationsNotesStatus { get; set; }

        public Guid? AllegationsNotesStatusId { get; set; }
    }
}