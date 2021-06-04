using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class ExtraFieldConfiguration : IEntityTypeConfiguration<ExtraField>
    {
        public void Configure(EntityTypeBuilder<ExtraField> builder)
        {
            builder.HasKey(ef => ef.Id);
            builder.Property(ef => ef.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(ef => ef.ShowInList)
                .IsRequired().HasDefaultValue(true);

            builder.Property(ef => ef.IsActive)
                .IsRequired().HasDefaultValue(true);

            builder.Property(ef => ef.RelatedEntityName)
                .IsRequired().HasMaxLength(200);

            builder.Property(ef => ef.Name)
                .IsRequired().HasMaxLength(200);

            builder.Property(ef => ef.Title)
                .IsRequired().HasMaxLength(200);

            builder.Property(ef => ef.Type).IsRequired();
        }
    }
}
