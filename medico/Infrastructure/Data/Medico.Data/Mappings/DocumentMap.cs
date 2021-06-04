using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class DocumentMap : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.HasKey(vs => vs.Id);
            builder.Property(vs => vs.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.CreateDate).IsRequired();

            builder.HasOne(vs => vs.Patient);
        }
    }
}
