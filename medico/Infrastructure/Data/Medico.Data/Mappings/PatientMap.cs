using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class PatientMap : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(p => p.FirstName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.LastName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.NameSuffix).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.Gender).IsRequired();

            builder.Property(p => p.DateOfBirth).IsRequired();

            builder.Property(p => p.MaritalStatus).IsRequired();

            builder.Property(p => p.Ssn).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.PrimaryPhone).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.SecondaryPhone).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.PrimaryAddress).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(p => p.SecondaryAddress).HasMaxLength(SqlColumnLength.Long);

            builder.Property(p => p.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.Email).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.State).IsRequired();

            builder.Property(p => p.Zip).IsRequired();

            builder.Property(p => p.ZipCodeType).IsRequired();

            builder.HasOne(p => p.Company)
                .WithMany(c => c.Patients)
                .HasForeignKey(c => c.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.PatientInsurance)
                .WithOne(i => i.Patient)
                .HasForeignKey<Patient>(p => p.PatientInsuranceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
