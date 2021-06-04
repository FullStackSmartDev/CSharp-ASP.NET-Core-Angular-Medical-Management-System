using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class TemplateLookupItemConfiguration : IEntityTypeConfiguration<TemplateLookupItem>
    {
        public void Configure(EntityTypeBuilder<TemplateLookupItem> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(t => t.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(t => t.JsonValues)
                .IsRequired();

            builder.Property(a => a.IsActive)
                .IsRequired().HasDefaultValue(true);

            builder.Property(a => a.Title).HasMaxLength(200);

            builder.HasOne(t => t.Company)
                .WithMany(c => c.TemplateLookupItems);
        }
    }
}
