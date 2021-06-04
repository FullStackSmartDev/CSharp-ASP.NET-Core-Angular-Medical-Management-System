using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class PatientInsuranceMap
        : IEntityTypeConfiguration<PatientInsurance>
    {
        public void Configure(EntityTypeBuilder<PatientInsurance> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(p => p.FirstName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.LastName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.Gender).IsRequired();

            builder.Property(p => p.DateOfBirth).IsRequired();

            builder.Property(p => p.Ssn).IsRequired().HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.PrimaryPhone).IsRequired().HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.SecondaryPhone).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.PrimaryAddress).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(p => p.SecondaryAddress)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(p => p.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.Email).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.State).IsRequired();

            builder.Property(p => p.Zip).IsRequired();

            builder.Property(p => p.ZipCodeType).IsRequired();

            builder.Property(p => p.CaseNumber).HasMaxLength(SqlColumnLength.Short);

            builder.Property(p => p.RqId).HasMaxLength(SqlColumnLength.Short);
        }
    }
}
