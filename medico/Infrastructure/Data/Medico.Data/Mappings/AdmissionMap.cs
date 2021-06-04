using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class AdmissionMap : IEntityTypeConfiguration<Admission>
    {
        public void Configure(EntityTypeBuilder<Admission> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreatedDate).IsRequired();

            builder.Property(a => a.AdmissionData).IsRequired();

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.Admissions)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);

            builder.HasOne(a => a.SignatureInfo)
                .WithOne(c => c.Admission)
                .HasForeignKey<SignatureInfo>(a => a.AdmissionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
