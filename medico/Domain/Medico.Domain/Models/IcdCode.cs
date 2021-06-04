using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class BaseCode : Entity
    {
        public string Code { get; set; }

        public string Name { get; set; }
    }

    public class IcdCode : BaseCode
    {
        public string Notes { get; set; }

        public List<IcdCodeChiefComplaintKeyword> IcdCodeChiefComplaintKeywords { get; set; }
    }
}
