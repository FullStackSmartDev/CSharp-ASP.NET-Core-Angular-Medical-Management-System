using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class PatientDemographicConfiguration : IEntityTypeConfiguration<PatientDemographic>
    {
        public void Configure(EntityTypeBuilder<PatientDemographic> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(p => p.FirstName).HasMaxLength(100).IsRequired();
            builder.Property(p => p.LastName).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Gender).IsRequired();
            builder.Property(p => p.DateOfBirth).IsRequired();
            builder.Property(p => p.MaritalStatus).IsRequired();
            builder.Property(p => p.Ssn).IsRequired().HasMaxLength(100);
            builder.Property(p => p.PrimaryPhone).IsRequired().HasMaxLength(100);
            builder.Property(p => p.SecondaryPhone).HasMaxLength(100);
            builder.Property(p => p.PrimaryAddress).HasMaxLength(400).IsRequired();
            builder.Property(p => p.SecondaryAddress).HasMaxLength(400);
            builder.Property(p => p.City).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Email).HasMaxLength(100).IsRequired();
            builder.Property(p => p.State).IsRequired();
            builder.Property(p => p.Zip).IsRequired();
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);

            builder.HasOne(p => p.Company)
                .WithMany(c => c.PatientDemographics);

            builder.HasOne(p => p.PatientInsurance)
                .WithOne(i => i.PatientDemographic)
                .HasForeignKey<PatientDemographic>(a => a.PatientInsuranceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.BaseVitalSigns)
                .WithOne(vs => vs.Patient)
                .HasForeignKey<BaseVitalSigns>(p => p.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
