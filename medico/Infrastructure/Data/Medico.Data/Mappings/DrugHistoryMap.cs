using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class DrugHistoryMap : IEntityTypeConfiguration<DrugHistory>
    {
        public void Configure(EntityTypeBuilder<DrugHistory> builder)
        {
            builder.HasKey(dh => dh.Id);
            builder.Property(dh => dh.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(dh => dh.Status).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Type).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Use).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(dh => dh.Frequency).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Duration).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.StatusLengthType).HasMaxLength(SqlColumnLength.Short);

            builder.Property(dh => dh.Route).HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(dh => dh.Patient)
                .WithMany(p => p.DrugHistory)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
