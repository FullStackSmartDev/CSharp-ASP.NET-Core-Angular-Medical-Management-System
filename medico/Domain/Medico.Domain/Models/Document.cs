using System;

namespace Medico.Domain.Models
{
    public class Document : Entity
    {
        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public string DocumentData { get; set; }

        public DateTime CreateDate { get; set; }
    }
}
