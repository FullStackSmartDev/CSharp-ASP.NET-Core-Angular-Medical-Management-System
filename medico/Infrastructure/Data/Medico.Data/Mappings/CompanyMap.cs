using Medico.Data.Constants;
using Medico.Domain.Enums;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class CompanyMap : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.Property(c => c.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Name).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(c => c.Address).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(c => c.SecondaryAddress)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(c => c.City).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(c => c.Fax).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(c => c.Phone).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(c => c.ZipCode).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.ZipCodeType).IsRequired()
                .HasDefaultValue(ZipCodeType.NineDigit);

            builder.Property(c => c.State).IsRequired();

            builder.Property(c => c.WebSiteUrl)
                .HasMaxLength(SqlColumnLength.Long);
        }
    }
}
