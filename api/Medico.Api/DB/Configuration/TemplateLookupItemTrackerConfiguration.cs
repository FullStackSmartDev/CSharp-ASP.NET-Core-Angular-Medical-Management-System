using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class TemplateLookupItemTrackerConfiguration : IEntityTypeConfiguration<TemplateLookupItemTracker>
    {
        public void Configure(EntityTypeBuilder<TemplateLookupItemTracker> builder)
        {
            builder.HasKey(t => new { t.TemplateId, t.TemplateLookupItemId });

            builder.Property(t => t.TemplateId)
                .IsRequired();

            builder.Property(t => t.TemplateLookupItemId)
                .IsRequired();

            builder.Property(t => t.NumberOfLookupItemsInTemplate)
                .IsRequired();
        }
    }
}
