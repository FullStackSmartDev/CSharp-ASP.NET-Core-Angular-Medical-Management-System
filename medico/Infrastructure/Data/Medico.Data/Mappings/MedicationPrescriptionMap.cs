using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationPrescriptionMap : IEntityTypeConfiguration<MedicationPrescription>
    {
        public void Configure(EntityTypeBuilder<MedicationPrescription> builder)
        {
            builder.HasKey(mp => mp.Id);
            builder.Property(mp => mp.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(mp => mp.Dose)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.Property(mp => mp.DosageForm)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(mp => mp.Route)
                .HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(mp => mp.Units)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.Property(mp => mp.Dispense).IsRequired();

            builder.Property(mp => mp.Refills).IsRequired();

            builder.Property(mp => mp.Sig).IsRequired()
                .HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(mp => mp.Medication).IsRequired()
                .HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(mp => mp.StartDate).IsRequired();

            builder.Property(mp => mp.EndDate).IsRequired();

            builder.HasOne(mp => mp.Patient)
                .WithMany(p => p.MedicationPrescriptions)
                .HasForeignKey(mp => mp.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mp => mp.Admission)
                .WithMany(a => a.MedicationPrescriptions)
                .HasForeignKey(mp => mp.AdmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mp => mp.MedicationName)
                .WithMany(mn => mn.MedicationPrescriptions)
                .HasForeignKey(mp => mp.MedicationNameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}