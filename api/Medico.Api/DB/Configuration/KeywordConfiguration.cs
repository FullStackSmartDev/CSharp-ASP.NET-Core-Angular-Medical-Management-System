using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class KeywordConfiguration : IEntityTypeConfiguration<Keyword>
    {
        public void Configure(EntityTypeBuilder<Keyword> builder)
        {
            builder.HasKey(k => k.Id);
            builder.Property(k => k.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(k => k.Value).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
