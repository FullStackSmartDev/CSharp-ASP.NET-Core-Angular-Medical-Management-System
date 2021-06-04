using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class TemplateSelectableListMap
        : IEntityTypeConfiguration<TemplateSelectableList>
    {
        public void Configure(EntityTypeBuilder<TemplateSelectableList> builder)
        {
            builder.HasKey(sl => new { sl.TemplateId, sl.SelectableListId });

            builder.HasOne(sl => sl.Template)
                .WithMany(t => t.TemplateSelectableLists)
                .HasForeignKey(sl => sl.TemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sl => sl.SelectableList)
                .WithMany(l => l.TemplateSelectableLists)
                .HasForeignKey(sl => sl.SelectableListId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibraryTemplateSelectableLists();
        }
    }
}
