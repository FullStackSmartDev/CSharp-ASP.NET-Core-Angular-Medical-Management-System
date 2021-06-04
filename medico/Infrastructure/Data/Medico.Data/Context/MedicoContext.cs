using Medico.Data.Mappings;
using Medico.Domain.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Medico.Data.Context
{
    public class MedicoContext : DbContext
    {
        private readonly IHostingEnvironment _env;

        public MedicoContext(
            DbContextOptions<MedicoContext> options) : base(options)
        {
        }

        public MedicoContext(IHostingEnvironment env)
        {
            _env = env;
        }

        public static bool IsMigration = true;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CompanyMap());
            modelBuilder.ApplyConfiguration(new LocationMap());
            modelBuilder.ApplyConfiguration(new RoomMap());
            modelBuilder.ApplyConfiguration(new MedicoApplicationUserMap());
            modelBuilder.ApplyConfiguration(new SelectableListCategoryMap());
            modelBuilder.ApplyConfiguration(new SelectableListMap());
            modelBuilder.ApplyConfiguration(new TemplateTypeMap());
            modelBuilder.ApplyConfiguration(new TemplateMap());
            modelBuilder.ApplyConfiguration(new ChiefComplaintMap());
            modelBuilder.ApplyConfiguration(new ChiefComplaintTemplateMap());
            modelBuilder.ApplyConfiguration(new ChiefComplaintRelatedKeywordMap());
            modelBuilder.ApplyConfiguration(new ChiefComplaintKeywordMap());
            modelBuilder.ApplyConfiguration(new IcdCodeMap());
            modelBuilder.ApplyConfiguration(new IcdCodeChiefComplaintKeywordMap());
            modelBuilder.ApplyConfiguration(new PatientMap());
            modelBuilder.ApplyConfiguration(new PatientInsuranceMap());
            modelBuilder.ApplyConfiguration(new AppointmentMap());
            modelBuilder.ApplyConfiguration(new AdmissionMap());
            modelBuilder.ApplyConfiguration(new SignatureInfoMap());
            modelBuilder.ApplyConfiguration(new TemplateSelectableListMap());
            modelBuilder.ApplyConfiguration(new TobaccoHistoryMap());
            modelBuilder.ApplyConfiguration(new DrugHistoryMap());
            modelBuilder.ApplyConfiguration(new AlcoholHistoryMap());
            modelBuilder.ApplyConfiguration(new MedicalHistoryMap());
            modelBuilder.ApplyConfiguration(new SurgicalHistoryMap());
            modelBuilder.ApplyConfiguration(new FamilyHistoryMap());
            modelBuilder.ApplyConfiguration(new EducationHistoryMap());
            modelBuilder.ApplyConfiguration(new OccupationalHistoryMap());
            modelBuilder.ApplyConfiguration(new AllergyMap());
            modelBuilder.ApplyConfiguration(new MedicationMap());
            modelBuilder.ApplyConfiguration(new MedicationHistoryMap());
            modelBuilder.ApplyConfiguration(new MedicalRecordMap());
            modelBuilder.ApplyConfiguration(new VitalSignsMap());
            modelBuilder.ApplyConfiguration(new BaseVitalSignsMap());
            modelBuilder.ApplyConfiguration(new DocumentMap());
            modelBuilder.ApplyConfiguration(new CptCodeMap());
            modelBuilder.ApplyConfiguration(new DocumentMap());
            modelBuilder.ApplyConfiguration(new MedicationClassMedicationNameMap());
            modelBuilder.ApplyConfiguration(new MedicationClassMap());
            modelBuilder.ApplyConfiguration(new MedicationItemInfoMap());
            modelBuilder.ApplyConfiguration(new MedicationNameMap());
            modelBuilder.ApplyConfiguration(new MedicationPrescriptionMap());
            modelBuilder.ApplyConfiguration(new MedicationsUpdateItemMap());
            modelBuilder.ApplyConfiguration(new NdcCodeMap());
            modelBuilder.ApplyConfiguration(new VisionVitalSignsMap());
            modelBuilder.ApplyConfiguration(new AllegationsNotesStatusMap());
            modelBuilder.ApplyConfiguration(new PhraseMap());
            modelBuilder.ApplyConfiguration(new VitalSignsNotesMap());
            modelBuilder.ApplyConfiguration(new PatientChartNodeDocumentMap());
            modelBuilder.ApplyConfiguration(new ReferenceTableMap());
            modelBuilder.ApplyConfiguration(new ExpressionMap());
            modelBuilder.ApplyConfiguration(new ExpressionReferenceTableMap());
            modelBuilder.ApplyConfiguration(new TemplateExpressionMap());

            modelBuilder.Query<LocationRoom>().ToView("LocationRoom");
            modelBuilder.Query<CategorySelectableList>().ToView("CategorySelectableList");
            modelBuilder.Query<MedicoApplicationUserView>().ToView("MedicoApplicationUserView");
            modelBuilder.Query<AppointmentGridItem>().ToView("AppointmentGridItem");
            modelBuilder.Query<MedicationItemInfoView>().ToView("MedicationItemInfoView");

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (IsMigration)
                return;

            var config = new ConfigurationBuilder()
                .SetBasePath(_env.ContentRootPath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{_env.EnvironmentName}.json", true)
                .Build();

            optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"));

            optionsBuilder.EnableSensitiveDataLogging();
        }
    }
}