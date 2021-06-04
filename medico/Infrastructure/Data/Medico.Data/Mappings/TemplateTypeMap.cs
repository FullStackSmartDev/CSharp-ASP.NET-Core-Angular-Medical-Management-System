using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class TemplateTypeMap : IEntityTypeConfiguration<TemplateType>
    {
        public void Configure(EntityTypeBuilder<TemplateType> builder)
        {
            builder.HasKey(tt => tt.Id);
            builder.Property(tt => tt.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(tt => tt.IsActive).IsRequired();

            builder.Property(tt => tt.IsPredefined).IsRequired();

            builder.Property(tt => tt.Name).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(tt => tt.Title).HasMaxLength(SqlColumnLength.Short);

            builder.HasOne(tt => tt.Company)
                .WithMany(c => c.TemplateTypes)
                .HasForeignKey(tt => tt.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(tt => tt.LibraryTemplateType)
                .WithMany(c => c.LibraryRelatedTemplateTypes)
                .HasForeignKey(tt => tt.LibraryTemplateTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibraryTemplateTypes();
        }
    }
}
