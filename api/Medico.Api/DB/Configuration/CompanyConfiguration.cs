using System;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class CompanyConfiguration : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.Property(c => c.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Name).IsRequired();
            builder.Property(c => c.Address).IsRequired();
            builder.Property(c => c.City).IsRequired();
            builder.Property(c => c.SecondaryAddress).IsRequired();
            builder.Property(c => c.Fax).IsRequired();
            builder.Property(c => c.Phone).IsRequired();
            builder.Property(c => c.ZipCode).IsRequired();
            builder.Property(c => c.State).IsRequired();
            builder.Property(c => c.IsDelete).IsRequired().HasDefaultValue(false);
            builder.Property(c => c.WebSiteUrl)
                .HasMaxLength(200);
        }
    }
}
