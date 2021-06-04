using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class RoomMap : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(r => r.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(a => a.IsActive).IsRequired();

            builder.HasOne(r => r.Location)
                .WithMany(l => l.Rooms)
                .HasForeignKey(r => r.LocationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
