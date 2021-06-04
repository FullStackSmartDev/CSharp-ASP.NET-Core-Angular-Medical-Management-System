using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationItemInfoMap : IEntityTypeConfiguration<MedicationItemInfo>
    {
        public void Configure(EntityTypeBuilder<MedicationItemInfo> builder)
        {
            builder.HasKey(mii => new { mii.MedicationNameId, mii.DosageForm, mii.Route, mii.Strength, mii.Unit });

            builder.Property(mii => mii.Route)
                .HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(mii => mii.DosageForm)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.Property(mii => mii.Strength)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.Property(mii => mii.Unit)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.HasOne(mii => mii.MedicationName)
                .WithMany(mn => mn.MedicationItems)
                .HasForeignKey(r => r.MedicationNameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
