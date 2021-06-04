using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class SurgicalHistoryConfiguration : IEntityTypeConfiguration<SurgicalHistory>
    {
        public void Configure(EntityTypeBuilder<SurgicalHistory> builder)
        {
            builder.HasKey(sh => sh.Id);

            builder.Property(sh => sh.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(sh => sh.CreatedDate)
                .IsRequired();

            builder.Property(sh => sh.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(sh => sh.Diagnosis)
                .IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(sh => sh.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(sh => sh.Patient)
                .WithMany(p => p.SurgicalHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
