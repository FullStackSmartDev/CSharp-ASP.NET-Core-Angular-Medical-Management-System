using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels
{
    public class ApplicationUserViewModel
    {
        public ApplicationUserViewModel()
        {
            Roles = new List<string>();
            Errors = new List<string>();
        }

        public bool IsAuthenticated { get; set; }

        public List<string> Roles { get; }

        public List<string> Errors { get; }

        public Guid? CompanyId { get; set; }
    }
}
