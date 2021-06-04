using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ChiefComplaintTemplateMap : IEntityTypeConfiguration<ChiefComplaintTemplate>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintTemplate> builder)
        {
            builder.HasKey(ct => new { ct.ChiefComplaintId, ct.TemplateId });

            builder.HasOne(ct => ct.ChiefComplaint)
                .WithMany(c => c.ChiefComplaintTemplates)
                .HasForeignKey(ct => ct.ChiefComplaintId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ct => ct.Template)
                .WithMany(t => t.ChiefComplaintTemplates)
                .HasForeignKey(ct => ct.TemplateId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
