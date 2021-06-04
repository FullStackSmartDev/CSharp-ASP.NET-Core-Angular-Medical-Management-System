using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class EducationHistoryConfiguration : IEntityTypeConfiguration<EducationHistory>
    {
        public void Configure(EntityTypeBuilder<EducationHistory> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreatedDate)
                .IsRequired();

            builder.Property(a => a.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(a => a.Degree)
                .IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.EducationHistory)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
