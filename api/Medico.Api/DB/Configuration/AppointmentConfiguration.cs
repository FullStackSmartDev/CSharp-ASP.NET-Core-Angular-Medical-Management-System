using Medico.Api.Constants;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.StartDate).IsRequired();

            builder.Property(a => a.EndDate).IsRequired();

            builder.Property(a => a.AppointmentStatus)
              .HasMaxLength(200)
              .IsRequired();

            builder.Property(a => a.PhysicianId).IsRequired();

            builder.Property(a => a.NurseId).IsRequired();

            builder.Property(a => a.CompanyId).IsRequired();

            builder.Property(a => a.PatientDemographicId).IsRequired();

            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);

            builder.Property(a => a.Allegations).HasMaxLength(SqlColumnLength.Long);

            builder.HasOne(a => a.Admission)
                .WithOne(c => c.Appointment)
                .HasForeignKey<Admission>(a => a.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Company)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.CompanyId);

            builder.HasOne(a => a.PatientDemographic)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientDemographicId);

            builder.HasOne(a => a.Room)
                .WithMany(c => c.Appointments)
                .HasForeignKey(a => a.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Location)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.LocationId);
        }
    }
}
