using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ChiefComplaintRelatedKeywordMap : IEntityTypeConfiguration<ChiefComplaintRelatedKeyword>
    {
        public void Configure(EntityTypeBuilder<ChiefComplaintRelatedKeyword> builder)
        {
            builder.HasKey(cck => new { cck.ChiefComplaintId, cck.KeywordId });

            builder.HasOne(cck => cck.ChiefComplaint)
                .WithMany(cc => cc.ChiefComplaintsKeywords)
                .HasForeignKey(cck => cck.ChiefComplaintId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cck => cck.Keyword)
                .WithMany(k => k.ChiefComplaintsKeywords)
                .HasForeignKey(cck => cck.KeywordId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
