using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicalHistoryMap : IEntityTypeConfiguration<MedicalHistory>
    {
        public void Configure(EntityTypeBuilder<MedicalHistory> builder)
        {
            builder.HasKey(mh => mh.Id);
            builder.Property(mh => mh.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(mh => mh.CreateDate).IsRequired();

            builder.Property(mh => mh.Diagnosis).IsRequired().HasMaxLength(SqlColumnLength.Long);

            builder.Property(mh => mh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(mh => mh.Patient)
                .WithMany(p => p.MedicalHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
