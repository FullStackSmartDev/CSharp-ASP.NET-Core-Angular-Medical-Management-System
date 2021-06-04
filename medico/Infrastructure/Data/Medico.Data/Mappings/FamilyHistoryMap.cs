using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class FamilyHistoryMap : IEntityTypeConfiguration<FamilyHistory>
    {
        public void Configure(EntityTypeBuilder<FamilyHistory> builder)
        {
            builder.HasKey(fh => fh.Id);
            builder.Property(fh => fh.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(fh => fh.FamilyMember).HasMaxLength(SqlColumnLength.Short);

            builder.Property(fh => fh.FamilyStatus).HasMaxLength(SqlColumnLength.Short);

            builder.Property(fh => fh.Diagnosis).HasMaxLength(SqlColumnLength.Long);

            builder.Property(fh => fh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(fh => fh.Patient)
                .WithMany(c => c.FamilyHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(fh => fh.PatientId);
        }
    }
}
