using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class AlcoholHistoryMap : IEntityTypeConfiguration<AlcoholHistory>
    {
        public void Configure(EntityTypeBuilder<AlcoholHistory> builder)
        {
            builder.HasKey(ah => ah.Id);
            builder.Property(ah => ah.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(ah => ah.Status).HasMaxLength(SqlColumnLength.Short);

            builder.Property(ah => ah.Type).HasMaxLength(SqlColumnLength.Short);

            builder.Property(ah => ah.Use).HasMaxLength(SqlColumnLength.Short);

            builder.Property(ah => ah.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(ah => ah.Frequency).HasMaxLength(SqlColumnLength.Short);

            builder.Property(ah => ah.Duration).HasMaxLength(SqlColumnLength.Short);

            builder.Property(ah => ah.StatusLengthType).HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(ah => ah.Patient)
                .WithMany(p => p.AlcoholHistory)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
