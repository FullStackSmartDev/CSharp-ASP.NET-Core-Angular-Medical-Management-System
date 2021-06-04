using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class SelectableListCategoryMap : IEntityTypeConfiguration<SelectableListCategory>
    {
        public void Configure(EntityTypeBuilder<SelectableListCategory> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Title).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(c => c.IsActive).IsRequired();

            builder.HasOne(c => c.Company)
                .WithMany(company => company.SelectableListCategories)
                .HasForeignKey(c => c.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.LibrarySelectableListCategory)
                .WithMany(lc => lc.LibraryRelatedSelectableListCategories)
                .HasForeignKey(c => c.LibrarySelectableListCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibrarySelectableListCategories();
        }
    }
}