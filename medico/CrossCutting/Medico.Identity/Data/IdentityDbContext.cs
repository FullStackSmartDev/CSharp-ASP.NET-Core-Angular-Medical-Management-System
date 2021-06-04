using Medico.Identity.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Medico.Identity.Data
{
    public class IdentityDbContext 
        : IdentityDbContext<ApplicationUser>
    {
        public IdentityDbContext(
            DbContextOptions<IdentityDbContext> options)
            : base(options)
        {
        }
    }
}
