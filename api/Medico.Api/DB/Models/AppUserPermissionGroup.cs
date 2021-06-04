using System;

namespace Medico.Api.DB.Models
{
    public class AppUserPermissionGroup
    {
        public Guid AppUserId { get; set; }

        public Guid PermissionGroupId { get; set; }

        public PermissionGroup PermissionGroup { get; set; }

        public AppUser AppUser { get; set; }

        public bool IsDelete { get; set; }
    }
}