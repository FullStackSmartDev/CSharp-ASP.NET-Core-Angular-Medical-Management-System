using System;

namespace Medico.Api.DB.Models
{
    public class Addendum
    {
        public Guid Id { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }

        public Guid AdmissionId { get; set; }

        public Admission Admission { get; set; }
    }
}