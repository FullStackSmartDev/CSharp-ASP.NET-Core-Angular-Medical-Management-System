using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class ChiefComplaintConfiguration : IEntityTypeConfiguration<ChiefComplaint>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaint> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(u => u.Name).HasMaxLength(200).IsRequired();
            builder.Property(u => u.Title).HasMaxLength(200).IsRequired();
            builder.Property(u => u.IsDelete).HasDefaultValue(false).IsRequired();
        }
    }
}
