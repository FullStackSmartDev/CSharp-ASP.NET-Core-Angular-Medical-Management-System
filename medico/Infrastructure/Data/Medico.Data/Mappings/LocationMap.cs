using Medico.Data.Constants;
using Medico.Domain.Enums;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class LocationMap : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(l => l.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Address).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(l => l.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.State).IsRequired();

            builder.Property(l => l.Zip).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Fax).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.Phone).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(l => l.SecondaryAddress)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(p => p.ZipCodeType).IsRequired()
                .HasDefaultValue(ZipCodeType.NineDigit);

            builder.Property(a => a.IsActive).IsRequired();

            builder.HasOne(l => l.Company)
                .WithMany(c => c.Locations)
                .HasForeignKey(l => l.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
