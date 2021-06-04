using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class ExpressionMap : IEntityTypeConfiguration<Expression>
    {
        public void Configure(EntityTypeBuilder<Expression> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(e => e.Title).HasMaxLength(SqlColumnLength.Long)
                .IsRequired();

            builder.Property(e => e.Template).IsRequired();

            builder.HasOne(e => e.Company)
                .WithMany(company => company.Expressions)
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.LibraryExpression)
                .WithMany(e => e.LibraryExpressions)
                .HasForeignKey(t => t.LibraryExpressionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}