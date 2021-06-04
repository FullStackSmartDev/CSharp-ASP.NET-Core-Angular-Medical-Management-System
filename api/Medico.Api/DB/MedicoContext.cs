using Medico.Api.DB.Configuration;
using Medico.Api.DB.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.DB
{
    public class MedicoContext :DbContext
    {
        public MedicoContext(DbContextOptions<MedicoContext> options)
        : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CptCodeConfiguration());
            modelBuilder.ApplyConfiguration(new CompanyConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateLookupItemConfiguration());
            modelBuilder.ApplyConfiguration(new PatientDemographicConfiguration());
            modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new LocationConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new AdmissionConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateLookupItemCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new PatientDataModelConfiguration());
            modelBuilder.ApplyConfiguration(new ChiefComplaintConfiguration());
            modelBuilder.ApplyConfiguration(new MedicationConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateConfiguration());
            modelBuilder.ApplyConfiguration(new ChiefComplaintTemplateConfiguration());
            modelBuilder.ApplyConfiguration(new IcdCodeConfiguration());
            modelBuilder.ApplyConfiguration(new MedicalHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new SurgicalHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new EducationHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new OccupationalHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new AllergyConfiguration());
            modelBuilder.ApplyConfiguration(new MedicationHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            modelBuilder.ApplyConfiguration(new PermissionGroupConfiguration());
            modelBuilder.ApplyConfiguration(new AppUserPermissionGroupConfiguration());
            modelBuilder.ApplyConfiguration(new EntityExtraFieldMapConfiguration());
            modelBuilder.ApplyConfiguration(new ExtraFieldConfiguration());
            modelBuilder.ApplyConfiguration(new PatientInsuranceConfiguration());
            modelBuilder.ApplyConfiguration(new ChiefComplaintConfiguration());
            modelBuilder.ApplyConfiguration(new ChiefComplaintRelatedKeywordConfiguration());
            modelBuilder.ApplyConfiguration(new ChiefComplaintKeywordConfiguration());
            modelBuilder.ApplyConfiguration(new TobaccoHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new AlcoholHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new DrugHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new VitalSignsConfiguration());
            modelBuilder.ApplyConfiguration(new BaseVitalSignsConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateLookupItemTrackerConfiguration());
            modelBuilder.ApplyConfiguration(new AddendumConfiguration());
            modelBuilder.ApplyConfiguration(new RoomConfiguration());
            modelBuilder.ApplyConfiguration(new MedicalRecordConfiguration());
            modelBuilder.ApplyConfiguration(new SignatureInfoConfiguration());
            modelBuilder.ApplyConfiguration(new KeywordConfiguration());
            modelBuilder.ApplyConfiguration(new KeywordIcdCodeConfiguration());

            modelBuilder.Query<IcdCodeKeywordsView>().ToView("IcdCodeKeywordsView");
        }
    }
}