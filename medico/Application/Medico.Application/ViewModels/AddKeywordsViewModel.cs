using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels
{
    public class AddKeywordsViewModel
    {
        public Guid ChiefComplaintId { get; set; }

        public List<string> Keywords { get; set; }
    }
}