using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class PermissionGroup : BaseEntity
    {
        public string Name { get; set; }

        public string Permissions { get; set; }

        public List<AppUserPermissionGroup> UserPermissionGroups { get; set; }
    } 
}