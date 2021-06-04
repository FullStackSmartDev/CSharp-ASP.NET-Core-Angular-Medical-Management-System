using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class ChiefComplaintKeywordConfiguration : IEntityTypeConfiguration<ChiefComplaintKeyword>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintKeyword> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);
            builder.Property(a => a.Value).IsRequired().HasMaxLength(400);
        }
    }
}
