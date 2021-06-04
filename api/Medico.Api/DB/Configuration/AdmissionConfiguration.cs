using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class AdmissionConfiguration : IEntityTypeConfiguration<Admission>
    {
        public void Configure(EntityTypeBuilder<Admission> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreatedDate).IsRequired();

            builder.Property(a => a.AdmissionData).IsRequired();

            builder.Property(a => a.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.HasOne(a => a.PatientDemographic)
                .WithMany(c => c.Admissions)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientDemographicId);

            builder.HasOne(a => a.SignatureInfo)
                .WithOne(c => c.Admission)
                .HasForeignKey<SignatureInfo>(a => a.AdmissionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
