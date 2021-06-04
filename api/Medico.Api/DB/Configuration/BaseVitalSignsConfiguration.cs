using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class BaseVitalSignsConfiguration : IEntityTypeConfiguration<BaseVitalSigns>
    {
        public void Configure(EntityTypeBuilder<BaseVitalSigns> builder)
        {
            builder.HasKey(vs => vs.Id);

            builder.Property(vs => vs.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.DominantHand)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.OxygenUse)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);
        }
    }
}
