using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class TemplateMap : IEntityTypeConfiguration<Template>
    {
        public void Configure(EntityTypeBuilder<Template> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(t => t.Title).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(t => t.ReportTitle)
                .HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(t => t.TemplateOrder);

            builder.Property(t => t.DetailedTemplateHtml)
                .IsRequired();

            builder.Property(t => t.InitialDetailedTemplateHtml);

            builder.Property(t => t.TemplateOrder);

            builder.Property(t => t.IsRequired).IsRequired();

            builder.Property(t => t.IsHistorical).IsRequired();

            builder.Property(t => t.IsActive).IsRequired();

            builder.HasOne(t => t.TemplateType)
                .WithMany(tt => tt.Templates)
                .HasForeignKey(t => t.TemplateTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(t => t.Company)
                .WithMany(c => c.Templates)
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.LibraryTemplate)
                .WithMany(lt => lt.LibraryRelatedTemplates)
                .HasForeignKey(t => t.LibraryTemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibraryTemplates();
        }
    }
}