using System;

namespace Medico.Domain.Models
{
    public class SignatureInfo : Entity
    {
        public Guid PhysicianId { get; set; }

        public MedicoApplicationUser Physician { get; set; }

        public Guid AdmissionId { get; set; }

        public Admission Admission { get; set; }

        public DateTime SignDate { get; set; }

        public bool IsUnsigned { get; set; }
    }
}