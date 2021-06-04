using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class TemplateLookupItemCategoryConfiguration : IEntityTypeConfiguration<TemplateLookupItemCategory>
    {
        public void Configure(EntityTypeBuilder<TemplateLookupItemCategory> builder)
        {
            builder.HasKey(tc => tc.Id);

            builder.Property(tc => tc.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(a => a.IsActive).IsRequired()
                .HasDefaultValue(false);

            builder.Property(a => a.Title).HasMaxLength(200);

            builder.HasMany(t => t.TemplateLookupItems)
                .WithOne(t => t.TemplateLookupItemCategory);
        }
    }
}
