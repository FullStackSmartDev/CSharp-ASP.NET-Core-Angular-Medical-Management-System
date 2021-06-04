using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class SignatureInfoMap : IEntityTypeConfiguration<SignatureInfo>
    {
        public void Configure(EntityTypeBuilder<SignatureInfo> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(s => s.SignDate).IsRequired();

            builder.Property(s => s.IsUnsigned).IsRequired();

            builder.HasOne(s => s.Physician)
                .WithMany(e => e.Signatures)
                .HasForeignKey(s => s.PhysicianId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
