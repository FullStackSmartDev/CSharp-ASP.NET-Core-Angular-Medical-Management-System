using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class TemplateExpressionMap : IEntityTypeConfiguration<TemplateExpression>
    {
        public void Configure(EntityTypeBuilder<TemplateExpression> builder)
        {
            builder.HasKey(sl => new { sl.TemplateId, sl.ExpressionId });

            builder.HasOne(te => te.Template)
                .WithMany(t => t.TemplateExpressions)
                .HasForeignKey(te => te.TemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(te => te.Expression)
                .WithMany(e => e.ExpressionTemplates)
                .HasForeignKey(te => te.ExpressionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}