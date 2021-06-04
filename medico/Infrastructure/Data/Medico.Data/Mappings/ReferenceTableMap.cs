using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ReferenceTableMap : IEntityTypeConfiguration<ReferenceTable>
    {
        public void Configure(EntityTypeBuilder<ReferenceTable> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(t => t.Title).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(t => t.Data).IsRequired();

            builder.HasOne(t => t.Company)
                .WithMany(company => company.ReferenceTables)
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.LibraryReferenceTable)
                .WithMany(t => t.LibraryRelatedReferenceTables)
                .HasForeignKey(t => t.LibraryReferenceTableId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.AddLibraryReferenceTables();
        }
    }
}