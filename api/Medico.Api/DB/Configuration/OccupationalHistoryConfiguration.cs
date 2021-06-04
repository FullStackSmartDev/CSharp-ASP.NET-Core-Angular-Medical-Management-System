using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class OccupationalHistoryConfiguration : IEntityTypeConfiguration<OccupationalHistory>
    {
        public void Configure(EntityTypeBuilder<OccupationalHistory> builder)
        {
            builder.HasKey(oh => oh.Id);
            builder.Property(oh => oh.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(oh => oh.Start)
                .IsRequired();

            builder.Property(oh => oh.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(oh => oh.EmploymentStatus)
                .IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(oh => oh.OccupationalType)
                .IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.DisabilityClaimDetails)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.WorkersCompensationClaimDetails)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(oh => oh.CreatedDate)
                .IsRequired();

            builder.HasOne(oh => oh.Patient)
                .WithMany(p => p.OccupationalHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(oh => oh.PatientId);
        }
    }
}
