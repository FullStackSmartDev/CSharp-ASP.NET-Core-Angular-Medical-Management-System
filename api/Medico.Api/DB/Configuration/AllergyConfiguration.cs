using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
  public class AllergyConfiguration : IEntityTypeConfiguration<Allergy>
  {
    public void Configure(EntityTypeBuilder<Allergy> builder)
    {
      builder.HasKey(a => a.Id);
      builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");

      builder.Property(a => a.CreatedDate)
        .IsRequired();

      builder.Property(a => a.Reaction)
        .IsRequired()
        .HasMaxLength(200);

      builder.Property(a => a.Medication)
        .IsRequired()
        .HasMaxLength(400);

      builder.Property(a => a.IsDelete)
        .IsRequired()
        .HasDefaultValue(false);

      builder.HasOne(a => a.Patient)
          .WithMany(c => c.Allergies)
          .OnDelete(DeleteBehavior.Restrict)
          .HasForeignKey(a => a.PatientId);
    }
  }
}
