using System;

namespace Medico.Api.DB.Models
{
    public class SignatureInfo
    {
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        public Employee Employee { get; set; }

        public Guid AdmissionId { get; set; }

        public Admission Admission { get; set; }

        public DateTime SignDate { get; set; }

        public bool IsUnsigned { get; set; }
    }
}