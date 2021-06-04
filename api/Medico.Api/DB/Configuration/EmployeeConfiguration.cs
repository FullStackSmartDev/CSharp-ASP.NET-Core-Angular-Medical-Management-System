using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
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

            builder.Property(e => e.Address).HasMaxLength(200)
                .IsRequired();

            builder.Property(e => e.SecondaryAddress).HasMaxLength(200);

            builder.Property(e => e.City).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.Zip).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.PrimaryPhone).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.SecondaryPhone).HasMaxLength(SqlColumnLength.Short);

            builder.Property(e => e.EmployeeType).IsRequired();

            builder.Property(e => e.Ssn).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(e => e.Gender).IsRequired();

            builder.Property(e => e.DateOfBirth).IsRequired();

            builder.Property(e => e.State).HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.IsActive).IsRequired()
                .HasDefaultValue(true);

            builder.HasOne(p => p.Company).WithMany(c => c.Employees);
        }
    }
}
