using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class BaseVitalSignsMap : IEntityTypeConfiguration<BaseVitalSigns>
    {
        public void Configure(EntityTypeBuilder<BaseVitalSigns> builder)
        {
            builder.HasKey(vs => vs.Id);
            builder.Property(vs => vs.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.DominantHand).HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.OxygenUse).HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(p => p.Patient)
                .WithOne(vs => vs.BaseVitalSigns)
                .HasForeignKey<BaseVitalSigns>(p => p.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}