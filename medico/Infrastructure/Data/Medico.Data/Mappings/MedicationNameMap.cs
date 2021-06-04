using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationNameMap : IEntityTypeConfiguration<MedicationName>
    {
        public void Configure(EntityTypeBuilder<MedicationName> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Name).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
