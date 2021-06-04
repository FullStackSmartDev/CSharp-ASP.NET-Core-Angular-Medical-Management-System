using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class EntityExtraFieldMapConfiguration : IEntityTypeConfiguration<EntityExtraFieldMap>
    {
        public void Configure(EntityTypeBuilder<EntityExtraFieldMap> builder)
        {
            builder.HasKey(e => new { e.EntityId, e.ExtraFieldId });

            builder.Property(e => e.EntityId).IsRequired();
            builder.Property(e => e.ExtraFieldId).IsRequired();
            builder.Property(e => e.Value).IsRequired();
        }
    }
}
