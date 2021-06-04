using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class EducationHistoryMap : IEntityTypeConfiguration<EducationHistory>
    {
        public void Configure(EntityTypeBuilder<EducationHistory> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.Degree).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Notes)
                .HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.EducationHistory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);
        }
    }
}
