using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class FamilyHistoryConfiguration : IEntityTypeConfiguration<FamilyHistory>
    {
        public void Configure(EntityTypeBuilder<FamilyHistory> builder)
        {
            builder.HasKey(fh => fh.Id);

            builder.Property(fh => fh.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(fh => fh.CreatedDate)
                .IsRequired();

            builder.Property(fh => fh.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(fh => fh.FamilyMember)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(fh => fh.FamilyStatus)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(fh => fh.Diagnosis)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(fh => fh.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(fh => fh.Patient)
                .WithMany(c => c.FamilyHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(fh => fh.PatientId);
        }
    }
}
