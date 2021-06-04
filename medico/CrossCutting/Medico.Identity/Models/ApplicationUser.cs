using System;
using Microsoft.AspNetCore.Identity;

namespace Medico.Identity.Models
{
    public class ApplicationUser : IdentityUser
    {
        public Guid? CompanyId { get; set; }
    }
}