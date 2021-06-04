using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class TemplateConfiguration : IEntityTypeConfiguration<Template>
    {
        public void Configure(EntityTypeBuilder<Template> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(t => t.Name).IsRequired();

            builder.Property(t => t.Title).HasMaxLength(200);

            builder.Property(t => t.Value).IsRequired();

            builder.Property(t => t.ReportTitle)
                .HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(t => t.TemplateOrder);

            builder.Property(t => t.IsRequired)
                .IsRequired().HasDefaultValue(false);

            builder.Property(t => t.IsHistorical)
                .IsRequired().HasDefaultValue(false);

            builder.Property(t => t.IsActive).IsRequired()
                .HasDefaultValue(false);

            builder.HasOne(a => a.TemplateType)
                .WithMany(c => c.Templates)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.TemplateTypeId);
        }
    }
}
