using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class NdcCodeMap : IEntityTypeConfiguration<NdcCode>
    {
        public void Configure(EntityTypeBuilder<NdcCode> builder)
        {
            builder.HasKey(e => e.Code);
            builder.Property(e => e.Code).HasMaxLength(SqlColumnLength.Short).IsRequired();
        }
    }
}
