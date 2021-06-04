using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationHistoryMap : IEntityTypeConfiguration<MedicationHistory>
    {
        public void Configure(EntityTypeBuilder<MedicationHistory> builder)
        {
            builder.HasKey(mh => mh.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.MedicationStatus).HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Medication).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.DosageForm).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Dose).HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Route).HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Units).HasMaxLength(SqlColumnLength.Short);
            
            builder.Property(a => a.Sig).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.MedicationHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);

            builder.HasOne(a => a.MedicationName)
                .WithMany(mn => mn.MedicationHistory)
                .HasForeignKey(a => a.MedicationNameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
