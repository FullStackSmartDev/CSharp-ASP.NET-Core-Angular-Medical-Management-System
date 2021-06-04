using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class KeywordIcdCodeConfiguration : IEntityTypeConfiguration<KeywordIcdCode>
    {
        public void Configure(EntityTypeBuilder<KeywordIcdCode> builder)
        {
            builder.HasKey(kic => new { kic.IcdCodeId, kic.KeywordId });

            builder.HasOne(kic => kic.Keyword)
                .WithMany(kic => kic.KeywordIcdCodes)
                .HasForeignKey(kic => kic.KeywordId);

            builder.HasOne(kic => kic.IcdCode)
                .WithMany(kic => kic.KeywordIcdCodes)
                .HasForeignKey(kic => kic.IcdCodeId);
        }
    }
}
