using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class DrugHistoryConfiguration : IEntityTypeConfiguration<DrugHistory>
    {
        public void Configure(EntityTypeBuilder<DrugHistory> builder)
        {
            builder.HasKey(dh => dh.Id);

            builder.Property(dh => dh.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(dh => dh.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(dh => dh.Status)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Route)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Type)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Use)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(dh => dh.Frequency)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Duration)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.StatusLengthType)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.CreateDate)
                .IsRequired();

            builder.HasOne(dh => dh.Patient)
                .WithMany(p => p.DrugHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
