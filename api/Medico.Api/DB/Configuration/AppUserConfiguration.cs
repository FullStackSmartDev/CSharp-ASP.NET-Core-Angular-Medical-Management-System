using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.Property(u => u.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(u => u.IsDelete).IsRequired()
                .HasDefaultValue(false);

            builder.Property(u => u.Login).HasMaxLength(200)
                .IsRequired();

            builder.Property(u => u.Hash).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(a => a.IsSuperAdmin).IsRequired()
                .HasDefaultValue(false);

            builder.HasOne(e => e.Employee)
                .WithOne(u => u.AppUser)
                .HasForeignKey<Employee>(u => u.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
