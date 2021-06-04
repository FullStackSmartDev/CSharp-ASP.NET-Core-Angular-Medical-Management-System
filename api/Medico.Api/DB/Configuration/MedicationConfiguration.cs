using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class MedicationConfiguration : IEntityTypeConfiguration<Medication>
    {
        public void Configure(EntityTypeBuilder<Medication> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.NdcCode)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.PackageDescription)
                .HasMaxLength(4000);

            builder.Property(a => a.ElevenDigitNdcCode)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.NonProprietaryName)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.DosageFormName)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.RouteName)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.SubstanceName)
                .HasMaxLength(4000);

            builder.Property(a => a.StrengthNumber)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.StrengthUnit)
                .HasMaxLength(4000);

            builder.Property(a => a.PharmaceuticalClasses)
                .HasMaxLength(4000);

            builder.Property(a => a.DeaSchedule)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Status)
                .HasMaxLength(SqlColumnLength.Long);
        }
    }
}