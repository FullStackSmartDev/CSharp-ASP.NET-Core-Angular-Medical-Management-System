using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels
{
    public class IcdCodeKeywordsViewModel
    {
        public Guid IcdCodeId { get; set; }

        public string IcdCodeName { get; set; }

        public string IcdCodeDescription { get; set; }

        public IEnumerable<string> Keywords { get; set; }
    }
}