using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ChiefComplaintKeywordMap : IEntityTypeConfiguration<ChiefComplaintKeyword>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintKeyword> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.Value).IsRequired().HasMaxLength(SqlColumnLength.Long);
        }
    }
}
