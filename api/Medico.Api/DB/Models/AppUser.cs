using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class AppUser : BaseEntity
    {
        public string Hash { get; set; }

        public string Login { get; set; }

        public bool IsSuperAdmin { get; set; }

        public Guid? EmployeeId { get; set; }

        public Employee Employee { get; set; }

        public List<AppUserPermissionGroup> UserPermissionGroups { get; set; }
    }
}