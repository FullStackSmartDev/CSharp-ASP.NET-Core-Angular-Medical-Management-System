using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class IcdCodeChiefComplaintKeywordMap : IEntityTypeConfiguration<IcdCodeChiefComplaintKeyword>
    {
        public void Configure(EntityTypeBuilder<IcdCodeChiefComplaintKeyword> builder)
        {
            builder.HasKey(kic => new { kic.IcdCodeId, kic.ChiefComplaintKeywordId });

            builder.HasOne(kic => kic.ChiefComplaintKeyword)
                .WithMany(kic => kic.ChiefComplaintKeywordIcdCodes)
                .HasForeignKey(kic => kic.ChiefComplaintKeywordId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(kic => kic.IcdCode)
                .WithMany(kic => kic.IcdCodeChiefComplaintKeywords)
                .HasForeignKey(kic => kic.IcdCodeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}