using System;

namespace Medico.Api.DB.Models
{
    public class ChiefComplaintTemplate
    {
        public Guid ChiefComplaintId { get; set; }

        public ChiefComplaint ChiefComplaint { get; set; }

        public Template Template { get; set; }

        public Guid TemplateId { get; set; }

        public bool IsDelete { get; set; }
    }
}
