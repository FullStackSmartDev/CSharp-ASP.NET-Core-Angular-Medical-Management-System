using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
  public class AlcoholHistoryConfiguration : IEntityTypeConfiguration<AlcoholHistory>
  {
    public void Configure(EntityTypeBuilder<AlcoholHistory> builder)
    {
        builder.HasKey(ah => ah.Id);

        builder.Property(ah => ah.Id)
            .HasDefaultValueSql("newsequentialid()");

        builder.Property(ah => ah.IsDelete)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ah => ah.Status)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.Type)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.Use)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.Notes)
            .HasMaxLength(SqlColumnLength.Long);

        builder.Property(ah => ah.Frequency)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.Duration)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.StatusLengthType)
            .HasMaxLength(SqlColumnLength.Short);

        builder.Property(ah => ah.CreateDate)
            .IsRequired();

        builder.HasOne(ah => ah.Patient)
            .WithMany(p => p.AlcoholHistory)
            .OnDelete(DeleteBehavior.Restrict)
            .HasForeignKey(a => a.PatientId);
        }
  }
}
