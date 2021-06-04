using Medico.Data.Constants;
using Medico.Domain.Enums;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicoApplicationUserMap
        : IEntityTypeConfiguration<MedicoApplicationUser>
    {
        public void Configure(EntityTypeBuilder<MedicoApplicationUser> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(e => e.FirstName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.NamePrefix).HasMaxLength(SqlColumnLength.Short);

            builder.Property(e => e.NameSuffix).HasMaxLength(SqlColumnLength.Short);

            builder.Property(e => e.LastName).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.MiddleName).HasMaxLength(SqlColumnLength.Short);

            builder.Property(e => e.Email).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.Address).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(e => e.SecondaryAddress).HasMaxLength(SqlColumnLength.Long);

            builder.Property(e => e.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.Zip).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(p => p.ZipCodeType).IsRequired()
                .HasDefaultValue(ZipCodeType.NineDigit);

            builder.Property(e => e.PrimaryPhone).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.SecondaryPhone).HasMaxLength(SqlColumnLength.Short);

            builder.Property(e => e.EmployeeType).IsRequired();

            builder.Property(e => e.Ssn).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.Gender).IsRequired();

            builder.Property(e => e.DateOfBirth).IsRequired();

            builder.Property(e => e.State).IsRequired();

            builder.Property(a => a.IsActive).IsRequired();

            builder.HasOne(e => e.Company)
                .WithMany(c => c.MedicoApplicationUsers)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}