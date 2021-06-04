using System;

namespace Medico.Domain.Models
{   
    public class IcdCodeChiefComplaintKeyword
    {
        public Guid ChiefComplaintKeywordId { get; set; }

        public ChiefComplaintKeyword ChiefComplaintKeyword { get; set; }

        public Guid IcdCodeId { get; set; }

        public IcdCode IcdCode { get; set; }
    }
}
