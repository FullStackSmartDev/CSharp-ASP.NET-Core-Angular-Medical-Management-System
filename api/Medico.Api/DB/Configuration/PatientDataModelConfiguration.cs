using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Api.DB.Configuration
{
    public class PatientDataModelConfiguration : IEntityTypeConfiguration<PatientDataModel>
    {
        public void Configure(EntityTypeBuilder<PatientDataModel> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).HasDefaultValueSql("newsequentialid()");
            builder.Property(a => a.IsDelete).IsRequired().HasDefaultValue(false);
            builder.Property(a => a.JsonPatientDataModel).IsRequired();

            builder.HasOne(a => a.Company)
                .WithOne(c => c.PatientDataModel)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey<PatientDataModel>(c => c.CompanyId);
        }
    }
}
