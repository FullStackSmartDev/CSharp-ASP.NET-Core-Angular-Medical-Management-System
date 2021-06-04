using System;

namespace Medico.Domain.Models
{
    public class AllegationsNotesStatus : Entity
    {
        public Guid AdmissionId { get; set; }

        public Admission Admission { get; set; }

        public bool IsReviewed { get; set; }
    }
}
