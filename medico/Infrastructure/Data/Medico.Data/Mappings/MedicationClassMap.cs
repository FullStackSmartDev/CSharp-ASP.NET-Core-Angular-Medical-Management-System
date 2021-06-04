using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationClassMap : IEntityTypeConfiguration<MedicationClass>
    {
        public void Configure(EntityTypeBuilder<MedicationClass> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.ClassName).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
