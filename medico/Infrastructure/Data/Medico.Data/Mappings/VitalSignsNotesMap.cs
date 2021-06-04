using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class VitalSignsNotesMap : IEntityTypeConfiguration<VitalSignsNotes>
    {
        public void Configure(EntityTypeBuilder<VitalSignsNotes> builder)
        {
            builder.HasKey(vs => vs.Id);
            builder.Property(vs => vs.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.Notes)
                .HasMaxLength(SqlColumnLength.TooLong);

            builder.HasOne(vs => vs.Admission)
                .WithOne(a => a.VitalSignsNotes)
                .HasForeignKey<VitalSignsNotes>(vs => vs.AdmissionId);
        }
    }
}
