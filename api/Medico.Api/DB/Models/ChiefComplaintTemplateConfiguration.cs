using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Models
{
    public class ChiefComplaintTemplateConfiguration : IEntityTypeConfiguration<ChiefComplaintTemplate>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintTemplate> builder)
        {
            builder.HasKey(ct => new {ct.ChiefComplaintId, ct.TemplateId});

            builder.Property(ct => ct.IsDelete)
                .IsRequired().HasDefaultValue(false);

            builder.HasOne(ct => ct.ChiefComplaint)
                .WithMany(c => c.Templates)
                .HasForeignKey(ct => ct.ChiefComplaintId);

            builder.HasOne(ct => ct.Template)
                .WithMany(t => t.ChiefComplaints)
                .HasForeignKey(ct => ct.TemplateId);
        }
    }
}
