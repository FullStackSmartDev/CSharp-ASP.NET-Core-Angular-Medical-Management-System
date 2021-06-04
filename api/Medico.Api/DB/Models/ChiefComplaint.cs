using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class ChiefComplaint : BaseEntity
    {
        public string Name { get; set; }

        public string Title { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public List<ChiefComplaintTemplate> Templates { get; set; }

        public List<ChiefComplaintRelatedKeyword> ChiefComplaintsKeywords { get; set; }
    }
}