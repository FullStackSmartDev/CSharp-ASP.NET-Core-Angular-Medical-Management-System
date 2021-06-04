using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class PermissionGroupConfiguration : IEntityTypeConfiguration<PermissionGroup>
    {
        public void Configure(EntityTypeBuilder<PermissionGroup> builder)
        {
            builder.Property(u => u.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(u => u.IsDelete).IsRequired().HasDefaultValue(false);
            builder.Property(u => u.Name).HasMaxLength(200).IsRequired();
            builder.Property(u => u.Permissions).HasMaxLength(2000).IsRequired();
        }
    }
}
