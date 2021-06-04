using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class ChiefComplaintKeyword : BaseEntity
    {
        public string Value { get; set; }

        public List<ChiefComplaintRelatedKeyword> ChiefComplaintsKeywords { get; set; }
    }

    public class ChiefComplaintRelatedKeyword
    {
        public Guid ChiefComplaintId { get; set; }

        public ChiefComplaint ChiefComplaint { get; set; }

        public Guid KeywordId { get; set; }

        public ChiefComplaintKeyword Keyword { get; set; }

        public bool IsDelete { get; set; }
    }
}
