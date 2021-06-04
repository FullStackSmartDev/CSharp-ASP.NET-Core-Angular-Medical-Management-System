using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class MedicationHistoryConfiguration : IEntityTypeConfiguration<MedicationHistory>
    {
        public void Configure(EntityTypeBuilder<MedicationHistory> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreatedDate)
              .IsRequired();

            builder.Property(a => a.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(a => a.MedicationStatus)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Medication)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Dose)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.DoseSchedule)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Route)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Units)
                .HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.MedicationHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
