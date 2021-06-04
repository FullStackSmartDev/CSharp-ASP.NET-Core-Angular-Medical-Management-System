using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class PatientInsuranceConfiguration : IEntityTypeConfiguration<PatientInsurance>
    {
        public void Configure(EntityTypeBuilder<PatientInsurance> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(p => p.FirstName).HasMaxLength(100).IsRequired();
            builder.Property(p => p.LastName).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Gender).IsRequired();
            builder.Property(p => p.DateOfBirth).IsRequired();
            builder.Property(p => p.Ssn).IsRequired().HasMaxLength(100);
            builder.Property(p => p.PrimaryPhone).IsRequired().HasMaxLength(100);
            builder.Property(p => p.SecondaryPhone).HasMaxLength(100);
            builder.Property(p => p.PrimaryAddress).HasMaxLength(400).IsRequired();
            builder.Property(p => p.SecondaryAddress).HasMaxLength(400);
            builder.Property(p => p.City).HasMaxLength(100).IsRequired();
            builder.Property(p => p.Email).HasMaxLength(100).IsRequired();
            builder.Property(p => p.State).IsRequired();
            builder.Property(p => p.Zip).IsRequired();
            builder.Property(p => p.CaseNumber).HasMaxLength(100);
            builder.Property(p => p.RqId).HasMaxLength(100);
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);
        }
    }
}
