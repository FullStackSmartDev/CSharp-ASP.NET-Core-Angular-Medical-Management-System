using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class TemplateTypeConfiguration : IEntityTypeConfiguration<TemplateType>
    {
        public void Configure(EntityTypeBuilder<TemplateType> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.IsActive).IsRequired()
                .HasDefaultValue(false);

            builder.Property(a => a.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(a => a.Title).HasMaxLength(200);
        }
    }
}
