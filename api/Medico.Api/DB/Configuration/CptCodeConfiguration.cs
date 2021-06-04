using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class CptCodeConfiguration : IEntityTypeConfiguration<CptCode>
    {
        public void Configure(EntityTypeBuilder<CptCode> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(c => c.Code).IsRequired();
            builder.Property(c => c.Description).IsRequired();
            builder.Property(c => c.Name).IsRequired();
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);
        }
    }
}
