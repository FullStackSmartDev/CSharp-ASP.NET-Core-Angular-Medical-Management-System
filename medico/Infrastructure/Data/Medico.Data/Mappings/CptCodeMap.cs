using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class CptCodeMap : IEntityTypeConfiguration<CptCode>
    {
        public void Configure(EntityTypeBuilder<CptCode> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Code).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(c => c.Description).HasMaxLength(SqlColumnLength.Long);

            builder.Property(c => c.Name).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
