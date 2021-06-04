using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(l => l.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Address).HasMaxLength(200)
                .IsRequired();

            builder.Property(l => l.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.State).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Zip).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Fax).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Phone).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.SecondaryAddress)
                .HasMaxLength(200);

            builder.Property(a => a.IsActive).IsRequired()
                .HasDefaultValue(true);

            builder.HasOne(l => l.Company).WithMany(c => c.Locations);
        }
    }
}
