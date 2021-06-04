using System;

namespace Medico.Domain.Models
{
    public class ChiefComplaintTemplate
    {
        public Guid ChiefComplaintId { get; set; }

        public ChiefComplaint ChiefComplaint { get; set; }

        public Template Template { get; set; }

        public Guid TemplateId { get; set; }
    }
}