using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class OccupationalHistoryMap
        : IEntityTypeConfiguration<OccupationalHistory>
    {
        public void Configure(EntityTypeBuilder<OccupationalHistory> builder)
        {
            builder.HasKey(oh => oh.Id);
            builder.Property(oh => oh.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(oh => oh.OccupationalType).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.DisabilityClaimDetails).HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.WorkersCompensationClaimDetails).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(oh => oh.Patient)
                .WithMany(p => p.OccupationalHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(oh => oh.PatientId);
        }
    }
}
