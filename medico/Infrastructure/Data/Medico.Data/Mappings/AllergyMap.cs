using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class AllergyMap : IEntityTypeConfiguration<Allergy>
    {
        public void Configure(EntityTypeBuilder<Allergy> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreateDate).IsRequired();

            builder.Property(sh => sh.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.Reaction).IsRequired()
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(a => a.Medication).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(a => a.Patient)
                .WithMany(p => p.Allergies)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(a => a.PatientId);

            builder.HasOne(a => a.MedicationName)
                .WithMany(mn => mn.Allergies)
                .HasForeignKey(a => a.MedicationNameId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.MedicationClass)
                .WithMany(mc => mc.Allergies)
                .HasForeignKey(a => a.MedicationClassId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
