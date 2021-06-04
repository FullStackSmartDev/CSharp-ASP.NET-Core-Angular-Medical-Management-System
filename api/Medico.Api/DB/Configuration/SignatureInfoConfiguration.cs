using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class SignatureInfoConfiguration 
        : IEntityTypeConfiguration<SignatureInfo>
    {
        public void Configure(EntityTypeBuilder<SignatureInfo> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(s => s.SignDate).IsRequired();

            builder.Property(s => s.IsUnsigned).IsRequired()
                .HasDefaultValue(false);

            builder.HasOne(s => s.Employee)
                .WithMany(e => e.SignatureInfos)
                .HasForeignKey(s => s.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
