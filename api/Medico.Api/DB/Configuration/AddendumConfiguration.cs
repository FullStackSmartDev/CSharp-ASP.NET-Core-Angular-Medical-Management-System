using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class AddendumConfiguration : IEntityTypeConfiguration<Addendum>
    {
        public void Configure(EntityTypeBuilder<Addendum> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.CreatedDate)
                .IsRequired();

            builder.Property(a => a.Description)
                .HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.HasOne(a => a.Admission)
                .WithMany(a => a.Addendums)
                .HasForeignKey(a => a.AdmissionId);
        }
    }
}
