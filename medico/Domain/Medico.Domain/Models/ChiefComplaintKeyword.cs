using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class ChiefComplaintKeyword : Entity
    {
        public string Value { get; set; }

        public List<ChiefComplaintRelatedKeyword> ChiefComplaintsKeywords { get; set; }

        public List<IcdCodeChiefComplaintKeyword> ChiefComplaintKeywordIcdCodes { get; set; }
    }
}