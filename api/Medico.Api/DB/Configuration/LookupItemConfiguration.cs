using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class LookupItemConfiguration : IEntityTypeConfiguration<LookupItem>
    {
        public void Configure(EntityTypeBuilder<LookupItem> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(c => c.Value).IsRequired();
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);

            builder.HasOne(li => li.LookupItemCollection)
                .WithMany(lic => lic.LookupItems)
                .HasForeignKey(li => li.LookupItemCollectionId);
        }
    }
}
