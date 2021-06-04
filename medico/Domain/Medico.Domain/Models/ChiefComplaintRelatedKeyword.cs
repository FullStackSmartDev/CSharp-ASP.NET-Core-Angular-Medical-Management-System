using System;

namespace Medico.Domain.Models
{
    public class ChiefComplaintRelatedKeyword
    {
        public Guid ChiefComplaintId { get; set; }

        public ChiefComplaint ChiefComplaint { get; set; }

        public Guid KeywordId { get; set; }

        public ChiefComplaintKeyword Keyword { get; set; }
    }
}
