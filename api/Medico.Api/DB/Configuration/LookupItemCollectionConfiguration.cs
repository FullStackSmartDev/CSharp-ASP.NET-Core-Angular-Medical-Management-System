using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class LookupItemCollectionConfiguration : IEntityTypeConfiguration<LookupItemCollection>
    {
        public void Configure(EntityTypeBuilder<LookupItemCollection> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(c => c.Name).IsRequired();
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);

        }
    }
}
