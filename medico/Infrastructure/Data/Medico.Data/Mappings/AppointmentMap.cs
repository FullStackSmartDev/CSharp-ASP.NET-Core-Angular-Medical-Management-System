using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class AppointmentMap : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(a => a.StartDate).IsRequired();

            builder.Property(a => a.EndDate).IsRequired();

            builder.Property(a => a.AppointmentStatus).HasMaxLength(SqlColumnLength.Short)
                .IsRequired();

            builder.Property(a => a.PhysicianId).IsRequired();

            builder.Property(a => a.NurseId).IsRequired();

            builder.Property(a => a.Allegations).HasMaxLength(SqlColumnLength.Long);

            builder.Property(a => a.AllegationsNotes)
                .HasMaxLength(SqlColumnLength.TooLong);

            builder.HasOne(a => a.Admission)
                .WithOne(c => c.Appointment)
                .HasForeignKey<Admission>(a => a.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Company)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.CompanyId);

            builder.HasOne(a => a.Patient)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.PatientId);

            builder.HasOne(a => a.Room)
                .WithMany(c => c.Appointments)
                .HasForeignKey(a => a.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Location)
                .WithMany(c => c.Appointments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(a => a.LocationId);
            
            builder.HasOne(a => a.PatientChartDocument)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.PatientChartDocumentId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
