using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class ChiefComplaint : Entity
    {
        public string Name { get; set; }

        public string Title { get; set; }

        public Guid CompanyId { get; set; }
        
        public Company Company { get; set; }

        public List<ChiefComplaintTemplate> ChiefComplaintTemplates { get; set; }

        public List<ChiefComplaintRelatedKeyword> ChiefComplaintsKeywords { get; set; }
    }
}
