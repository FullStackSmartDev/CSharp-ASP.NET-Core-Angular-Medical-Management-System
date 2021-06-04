using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class PhraseMap : IEntityTypeConfiguration<Phrase>
    {
        public void Configure(EntityTypeBuilder<Phrase> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(p => p.Name).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(p => p.Title).IsRequired()
                .HasMaxLength(SqlColumnLength.Long);

            builder.Property(p => p.Content).IsRequired();

            builder.Property(p => p.ContentWithDefaultSelectableItemsValues);

            builder.Property(p => p.IsActive)
                .IsRequired().HasDefaultValue(true);

            builder.HasOne(p => p.Company)
                .WithMany(c => c.Phrases)
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}