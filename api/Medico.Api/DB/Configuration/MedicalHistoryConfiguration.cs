using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class MedicalHistoryConfiguration : IEntityTypeConfiguration<MedicalHistory>
    {
        public void Configure(EntityTypeBuilder<MedicalHistory> builder)
        {
            builder.HasKey(mh => mh.Id);

            builder.Property(mh => mh.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(mh => mh.CreatedDate)
                .IsRequired();

            builder.Property(sh => sh.Diagnosis)
                .IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(sh => sh.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(mh => mh.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.HasOne(mh => mh.Patient)
                .WithMany(p => p.MedicalHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);
        }
    }
}