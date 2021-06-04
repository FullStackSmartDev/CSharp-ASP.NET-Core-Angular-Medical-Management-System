using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class ChiefComplaintRelatedKeywordConfiguration : IEntityTypeConfiguration<ChiefComplaintRelatedKeyword>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintRelatedKeyword> builder)
        {
            builder.HasKey(cck => new { cck.ChiefComplaintId, cck.KeywordId });

            builder.Property(ct => ct.IsDelete)
                .IsRequired().HasDefaultValue(false);

            builder.HasOne(cck => cck.ChiefComplaint)
                .WithMany(cc => cc.ChiefComplaintsKeywords)
                .HasForeignKey(cck => cck.ChiefComplaintId);

            builder.HasOne(cck => cck.Keyword)
                .WithMany(k => k.ChiefComplaintsKeywords)
                .HasForeignKey(cck => cck.KeywordId);
        }
    }
}