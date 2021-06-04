using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationMap : IEntityTypeConfiguration<Medication>
    {
        public void Configure(EntityTypeBuilder<Medication> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.NdcCode).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.PackageDescription).HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(a => a.ElevenDigitNdcCode).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.NonProprietaryName).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.DosageFormName).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.RouteName).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.SubstanceName).HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(a => a.StrengthNumber).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.StrengthUnit).HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(a => a.PharmaceuticalClasses).HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(a => a.DeaSchedule).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Status).HasMaxLength(SqlColumnLength.Long);
        }
    }
}
