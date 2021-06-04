using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(l => l.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(a => a.IsActive).IsRequired()
                .HasDefaultValue(true);

            builder.HasOne(l => l.Location).WithMany(c => c.Rooms);
        }
    }
}
