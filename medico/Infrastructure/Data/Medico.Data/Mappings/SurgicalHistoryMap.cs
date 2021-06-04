using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class SurgicalHistoryMap : IEntityTypeConfiguration<SurgicalHistory>
    {
        public void Configure(EntityTypeBuilder<SurgicalHistory> builder)
        {
            builder.HasKey(sh => sh.Id);
            builder.Property(sh => sh.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(sh => sh.CreateDate).IsRequired();

            builder.Property(sh => sh.Diagnosis).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(sh => sh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(sh => sh.Patient)
                .WithMany(p => p.SurgicalHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
