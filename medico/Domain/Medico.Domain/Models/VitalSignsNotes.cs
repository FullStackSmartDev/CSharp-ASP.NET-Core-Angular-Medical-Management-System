using System;

namespace Medico.Domain.Models
{
    public class VitalSignsNotes : Entity
    {
        public Guid AdmissionId { get; set; }

        public Admission Admission { get; set; }

        public string Notes { get; set; }
    }
}