using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ExpressionReferenceTableMap : IEntityTypeConfiguration<ExpressionReferenceTable>
    {
        public void Configure(EntityTypeBuilder<ExpressionReferenceTable> builder)
        {
            builder.HasKey(ert => new { ert.ExpressionId, ert.ReferenceTableId });

            builder.HasOne(ert => ert.Expression)
                .WithMany(e => e.ExpressionReferenceTables)
                .HasForeignKey(sl => sl.ExpressionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ert => ert.ReferenceTable)
                .WithMany(rt => rt.ReferenceTableExpressions)
                .HasForeignKey(ert => ert.ReferenceTableId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}