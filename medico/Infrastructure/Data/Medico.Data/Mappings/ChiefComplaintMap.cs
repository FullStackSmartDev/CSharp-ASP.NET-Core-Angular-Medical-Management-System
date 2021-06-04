using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ChiefComplaintMap : IEntityTypeConfiguration<ChiefComplaint>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaint> builder)
        {
            builder.HasKey(cc => cc.Id);
            builder.Property(cc => cc.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(u => u.Name).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(u => u.Title).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();
        }
    }
}
