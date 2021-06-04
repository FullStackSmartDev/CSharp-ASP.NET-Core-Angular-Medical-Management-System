using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationClassMedicationNameMap : IEntityTypeConfiguration<MedicationClassMedicationName>
    {
        public void Configure(EntityTypeBuilder<MedicationClassMedicationName> builder)
        {
            builder.HasKey(cn => new { cn.MedicationClassId, cn.MedicationNameId });

            builder.HasOne(cn => cn.MedicationName)
                .WithMany(n => n.MedicationClasses)
                .HasForeignKey(cn => cn.MedicationNameId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cn => cn.MedicationClass)
                .WithMany(cn => cn.MedicationNames)
                .HasForeignKey(cn => cn.MedicationClassId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
