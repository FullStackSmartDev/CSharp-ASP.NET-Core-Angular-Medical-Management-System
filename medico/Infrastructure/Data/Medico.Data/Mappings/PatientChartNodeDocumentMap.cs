using Medico.Data.Constants;
using Medico.Data.Extensions;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class PatientChartNodeDocumentMap : IEntityTypeConfiguration<PatientChartDocumentNode>
    {
        public void Configure(EntityTypeBuilder<PatientChartDocumentNode> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(d => d.Title).HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(d => d.Name).HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(d => d.PatientChartDocumentNodeJsonString).IsRequired();

            builder.HasOne(d => d.Company)
                .WithMany(c => c.PatientChartNodeDocuments)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(d => d.LibraryPatientChartDocumentNode)
                .WithMany(ld => ld.LibraryPatientChartDocumentNodes)
                .HasForeignKey(d => d.LibraryPatientChartDocumentNodeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.AddLibraryPatientChartDocuments();
        }
    }
}
