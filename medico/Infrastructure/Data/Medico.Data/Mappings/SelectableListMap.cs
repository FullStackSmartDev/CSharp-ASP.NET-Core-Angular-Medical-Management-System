using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class SelectableListMap : IEntityTypeConfiguration<SelectableList>
    {
        public void Configure(EntityTypeBuilder<SelectableList> builder)
        {
            builder.HasKey(sl => sl.Id);
            builder.Property(sl => sl.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(sl => sl.JsonValues)
                .IsRequired();

            builder.Property(sl => sl.IsActive).IsRequired();

            builder.Property(sl => sl.IsPredefined).IsRequired()
                .HasDefaultValue(false);

            builder.Property(sl => sl.Title).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.HasOne(sl => sl.Company)
                .WithMany(c => c.SelectableLists)
                .HasForeignKey(sl => sl.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sl => sl.Category)
                .WithMany(c => c.SelectableLists)
                .HasForeignKey(sl => sl.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sl => sl.LibrarySelectableList)
                .WithMany(lsl => lsl.LibraryRelatedSelectableLists)
                .HasForeignKey(sl => sl.LibrarySelectableListId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibrarySelectableLists();
        }
    }
}