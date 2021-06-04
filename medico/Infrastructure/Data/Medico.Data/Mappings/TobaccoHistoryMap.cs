using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class TobaccoHistoryMap : IEntityTypeConfiguration<TobaccoHistory>
    {
        public void Configure(EntityTypeBuilder<TobaccoHistory> builder)
        {
            builder.HasKey(th => th.Id);
            builder.Property(th => th.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(th => th.Status).HasMaxLength(SqlColumnLength.Short);

            builder.Property(th => th.Type).HasMaxLength(SqlColumnLength.Short);

            builder.Property(th => th.Use).HasMaxLength(SqlColumnLength.Short);

            builder.Property(th => th.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(th => th.Frequency).HasMaxLength(SqlColumnLength.Short);

            builder.Property(th => th.Duration).HasMaxLength(SqlColumnLength.Short);

            builder.Property(th => th.StatusLengthType).HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(th => th.Patient)
                .WithMany(p => p.TobaccoHistory)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
