using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicalRecordMap : IEntityTypeConfiguration<MedicalRecord>
    {
        public void Configure(EntityTypeBuilder<MedicalRecord> builder)
        {
            builder.HasKey(mr => mr.Id);
            builder.Property(mr => mr.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(mr => mr.CreateDate).IsRequired();

            builder.Property(mr => mr.DocumentType).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(mr => mr.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(mr => mr.IncludeNotesInReport)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasOne(mr => mr.Patient)
                .WithMany(p => p.MedicalRecords)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);
        }
    }
}