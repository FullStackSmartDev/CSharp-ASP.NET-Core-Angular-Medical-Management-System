using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class AllegationsNotesStatusMap : IEntityTypeConfiguration<AllegationsNotesStatus>
    {
        public void Configure(EntityTypeBuilder<AllegationsNotesStatus> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.IsReviewed).IsRequired();

            builder.HasOne(a => a.Admission)
                .WithOne(c => c.AllegationsNotesStatus)
                .HasForeignKey<Admission>(a => a.AllegationsNotesStatusId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
