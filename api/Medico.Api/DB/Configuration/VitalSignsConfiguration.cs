using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class VitalSignsConfiguration : IEntityTypeConfiguration<VitalSigns>
    {
        public void Configure(EntityTypeBuilder<VitalSigns> builder)
        {
            builder.HasKey(vs => vs.Id);

            builder.Property(vs => vs.Id)
                .HasDefaultValueSql("newsequentialid()");

            builder.Property(vs => vs.BloodPressurePosition)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.BloodPressureLocation)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.OxygenSaturationAtRest)
                .HasMaxLength(SqlColumnLength.Short);

            builder.Property(vs => vs.IsDelete)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(vs => vs.CreateDate)
                .IsRequired();

            builder.HasOne(vs => vs.Admission)
                .WithMany(a => a.VitalSigns)
                .OnDelete(DeleteBehavior.Cascade)
                .HasForeignKey(vs => vs.AdmissionId);

            builder.HasOne(vs => vs.Patient)
                .WithMany(p => p.VitalSigns)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(vs => vs.PatientId);
        }
    }
}
