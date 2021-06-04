using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class IcdCodeMap : IEntityTypeConfiguration<IcdCode>
    {
        public void Configure(EntityTypeBuilder<IcdCode> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Code).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(c => c.Notes).HasMaxLength(SqlColumnLength.Long);

            builder.Property(c => c.Name).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
