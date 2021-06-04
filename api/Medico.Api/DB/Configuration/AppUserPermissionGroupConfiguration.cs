using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class AppUserPermissionGroupConfiguration : IEntityTypeConfiguration<AppUserPermissionGroup>
    {
        public void Configure(EntityTypeBuilder<AppUserPermissionGroup> builder)
        { 
            builder.HasKey(up => new { up.AppUserId, up.PermissionGroupId });

            builder.Property(u => u.IsDelete).IsRequired().HasDefaultValue(false);

            builder.HasOne(up => up.AppUser)
                .WithMany(u => u.UserPermissionGroups)
                .HasForeignKey(up => up.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(up => up.PermissionGroup)
                .WithMany(c => c.UserPermissionGroups)
                .HasForeignKey(up => up.PermissionGroupId);
        }
    }
}
