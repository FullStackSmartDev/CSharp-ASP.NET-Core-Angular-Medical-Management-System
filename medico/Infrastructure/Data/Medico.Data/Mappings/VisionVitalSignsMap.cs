using System;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class VisionVitalSignsMap : IEntityTypeConfiguration<VisionVitalSigns>
    {
        public void Configure(EntityTypeBuilder<VisionVitalSigns> builder)
        {
            builder.HasKey(vs => vs.Id);
            builder.Property(vs => vs.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.WithGlasses).IsRequired().HasDefaultValue(false);

            builder.Property(vs => vs.Od).IsRequired();
            builder.Property(vs => vs.Os).IsRequired();
            builder.Property(vs => vs.Ou).IsRequired();
            builder.Property(vs => vs.CreateDate).IsRequired()
                .HasDefaultValue(DateTime.MinValue);

            builder.HasOne(vs => vs.Patient)
                .WithMany(a => a.VisualVitalSigns)
                .HasForeignKey(vs => vs.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
