using System;
using Medico.Application.ExpressionItemsManagement;
using Medico.Application.Interfaces;
using Medico.Application.MedicationsUpdate;
using Medico.Application.Queues;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.Services;
using Medico.Application.Services.PatientChart;
using Medico.Data.Context;
using Medico.Data.Repository;
using Medico.Data.UoW;
using Medico.Domain.Constants;
using Medico.Domain.Interfaces;
using Medico.Identity.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Medico.IoC
{
    public class NativeInjectorBootstrapper
    {
        public static void RegisterServices(IServiceCollection services)
        {
            // Infra - Data
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            MedicoContext.IsMigration = false;
            services.AddScoped(builder =>
            {
                var environment = builder.GetService<IHostingEnvironment>();
                return new MedicoContext(environment);
            });

            services.AddSingleton<MedicationsProvider>();

            RegisterRepositories(services);

            RegisterApplicationServices(services);

            RegisterDefaultValueProviders(services);

            RegisterBackgroundQueues(services);

            RegisterSelectableItems(services);
        }

        private static void RegisterBackgroundQueues(IServiceCollection services)
        {
            services.AddSingleton<MedicationsUpdateTaskQueue>();
        }

        private static void RegisterApplicationServices(IServiceCollection services)
        {
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<ICptCodeService, CptCodeService>();
            services.AddScoped<ILocationService, LocationService>();
            services.AddScoped<ILocationRoomService, LocationRoomService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISelectableListCategoryService, SelectableListCategoryService>();
            services.AddScoped<ISelectableListService, SelectableListService>();
            services.AddScoped<ITemplateTypeService, TemplateTypeService>();
            services.AddScoped<ITemplateService, TemplateService>();
            services.AddScoped<IChiefComplaintService, ChiefComplaintService>();
            services.AddScoped<IChiefComplaintKeywordService, ChiefComplaintKeywordService>();
            services.AddScoped<IIcdCodeService, IcdCodeService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IPatientInsuranceService, PatientInsuranceService>();
            services.AddScoped<ITemplateSelectableListService, TemplateSelectableListService>();
            services.AddScoped<IAdmissionService, AdmissionService>();
            services.AddScoped<ISignatureInfoService, SignatureInfoService>();
            services.AddScoped<ITobaccoHistoryService, TobaccoHistoryService>();
            services.AddScoped<IDrugHistoryService, DrugHistoryService>();
            services.AddScoped<IAlcoholHistoryService, AlcoholHistoryService>();
            services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
            services.AddScoped<ISurgicalHistoryService, SurgicalHistoryService>();
            services.AddScoped<IFamilyHistoryService, FamilyHistoryService>();
            services.AddScoped<IEducationHistoryService, EducationHistoryService>();
            services.AddScoped<IOccupationalHistoryService, OccupationalHistoryService>();
            services.AddScoped<IMedicationService, MedicationService>();
            services.AddScoped<IAllergyService, AllergyService>();
            services.AddScoped<IMedicationHistoryService, MedicationHistoryService>();
            services.AddScoped<IMedicalRecordService, MedicalRecordService>();
            services.AddScoped<IVitalSignsService, VitalSignsService>();
            services.AddScoped<IBaseVitalSignsService, BaseVitalSignsService>();
            services.AddScoped<IDefaultValueService, DefaultValueService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IMedicationPrescriptionService, MedicationPrescriptionService>();
            services.AddScoped<IMedicationClassService, MedicationClassService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IMedicationsUpdateItemService, MedicationsUpdateItemService>();
            services.AddScoped<IScheduleMedicationsUpdateService, ScheduleMedicationsUpdateService>();
            services.AddScoped<IVisionVitalSignsService, VisionVitalSignsService>();
            services.AddScoped<IAllegationsNotesStatusService, AllegationsNotesStatusService>();
            services.AddScoped<IPhraseService, PhraseService>();
            services.AddScoped<IVitalSignsNotesService, VitalSignsNotesService>();
            services.AddScoped<IDataSourceLoadOptionsHelper, DataSourceLoadOptionsHelper>();
            services.AddScoped<ICompanySecurityService, CompanySecurityService>();
            services.AddSingleton<IUniqueUsernameService, UniqueUsernameService>();
            services.AddScoped<ISendEmailService, SendEmailService>();
            services.AddScoped<IPatientChartDocumentNodeService, PatientChartDocumentNodeService>();
            services.AddScoped<ITemplateContentService, TemplateContentService>();
            services.AddScoped<ISelectableItemsService, SelectableItemsService>();
            services.AddScoped<IPatientChartService, PatientChartService>();
            services.AddScoped<ITemplateHistoryService, TemplateHistoryService>();
            services.AddScoped<IReferenceTableService, ReferenceTableService>();
            services.AddScoped<IExpressionService, ExpressionService>();
            services.AddScoped<IExpressionItemsService, ExpressionItemsService>();
            services.AddScoped<IExpressionExecutionService, ExpressionExecutionService>();
        }

        private static void RegisterSelectableItems(IServiceCollection services)
        {
            services.AddScoped<ISelectableItem, SelectableListItem>();
            services.AddScoped<ISelectableItem, SelectableRangeItem>();
            services.AddScoped<ISelectableItem, SelectableDateItem>();
            services.AddScoped<ISelectableItem, SelectableVariableItem>();
        }

        private static void RegisterRepositories(IServiceCollection services)
        {
            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<ISelectableListRepository, SelectableListRepository>();
            services.AddScoped<ICategorySelectableListViewRepository, CategorySelectableListViewRepository>();
            services.AddScoped<ISelectableListCategoryRepository, SelectableListCategoryRepository>();
            services.AddScoped<ILocationRepository, LocationRepository>();
            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<ILocationRoomViewRepository, LocationRoomViewRepository>();
            services.AddScoped<IMedicoApplicationUserRepository, MedicoApplicationUserRepository>();
            services.AddScoped<IMedicoApplicationUserViewRepository, MedicoApplicationUserViewRepository>();
            services.AddScoped<ITemplateTypeRepository, TemplateTypeRepository>();
            services.AddScoped<ITemplateRepository, TemplateRepository>();
            services.AddScoped<IChiefComplaintRepository, ChiefComplaintRepository>();
            services.AddScoped<IChiefComplaintTemplateRepository, ChiefComplaintTemplateRepository>();
            services.AddScoped<IChiefComplaintKeywordRepository, ChiefComplaintKeywordRepository>();
            services.AddScoped<IChiefComplaintRelatedKeywordRepository, ChiefComplaintRelatedKeywordRepository>();
            services.AddScoped<IIcdCodeRepository, IcdCodeRepository>();
            services.AddScoped<IIcdCodeChiefComplaintKeywordRepository, IcdCodeChiefComplaintKeywordRepository>();
            services.AddScoped<IAppointmentGridItemRepository, AppointmentGridItemRepository>();
            services.AddScoped<IPatientRepository, PatientRepository>();
            services.AddScoped<IPatientInsuranceRepository, PatientInsuranceRepository>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<ITemplateSelectableListRepository, TemplateSelectableListRepository>();
            services.AddScoped<IAdmissionRepository, AdmissionRepository>();
            services.AddScoped<ISignatureInfoRepository, SignatureInfoRepository>();
            services.AddScoped<ITobaccoHistoryRepository, TobaccoHistoryRepository>();
            services.AddScoped<IDrugHistoryRepository, DrugHistoryRepository>();
            services.AddScoped<IAlcoholHistoryRepository, AlcoholHistoryRepository>();
            services.AddScoped<IMedicalHistoryRepository, MedicalHistoryRepository>();
            services.AddScoped<ISurgicalHistoryRepository, SurgicalHistoryRepository>();
            services.AddScoped<IFamilyHistoryRepository, FamilyHistoryRepository>();
            services.AddScoped<IEducationHistoryRepository, EducationHistoryRepository>();
            services.AddScoped<IOccupationalHistoryRepository, OccupationalHistoryRepository>();
            services.AddScoped<IMedicationRepository, MedicationRepository>();
            services.AddScoped<IAllergyRepository, AllergyRepository>();
            services.AddScoped<IMedicationHistoryRepository, MedicationHistoryRepository>();
            services.AddScoped<IMedicalRecordRepository, MedicalRecordRepository>();
            services.AddScoped<IVitalSignsRepository, VitalSignsRepository>();
            services.AddScoped<IBaseVitalSignsRepository, BaseVitalSignsRepository>();
            services.AddScoped<IDocumentRepository, DocumentRepository>();
            services.AddScoped<ICptCodeRepository, CptCodeRepository>();
            services.AddScoped<IMedicationNameRepository, MedicationNameRepository>();
            services.AddScoped<IDocumentRepository, DocumentRepository>();
            services.AddScoped<IMedicationItemInfoViewRepository, MedicationItemInfoViewRepository>();
            services.AddScoped<IMedicationItemInfoRepository, MedicationItemInfoRepository>();
            services.AddScoped<IMedicationPrescriptionRepository, MedicationPrescriptionRepository>();
            services.AddScoped<IMedicationClassRepository, MedicationClassRepository>();
            services.AddScoped<IMedicationClassMedicationNameRepository, MedicationClassMedicationNameRepository>();
            services.AddScoped<IMedicationsUpdateItemRepository, MedicationsUpdateItemRepository>();
            services.AddScoped<INdcCodeRepository, NdcCodeRepository>();
            services.AddScoped<IVisionVitalSignsRepository, VisionVitalSignsRepository>();
            services.AddScoped<IAllegationsNotesStatusRepository, AllegationsNotesStatusRepository>();
            services.AddScoped<IPhraseRepository, PhraseRepository>();
            services.AddScoped<IVitalSignsNotesRepository, VitalSignsNotesRepository>();
            services.AddScoped<IPatientChartDocumentNodeRepository, PatientChartDocumentNodeRepository>();
            services.AddScoped<IReferenceTableRepository, ReferenceTableRepository>();
            services.AddScoped<IExpressionRepository, ExpressionRepository>();
            services.AddScoped<IExpressionReferenceTableRepository, ExpressionReferenceTableRepository>();
            services.AddScoped<ITemplateExpressionRepository, TemplateExpressionRepository>();
        }

        private static void RegisterDefaultValueProviders(IServiceCollection services)
        {
            const string unremarkable = "Unremarkable";
            const string none = "None";

            services.AddScoped<IDefaultValueProvider>(x
                => new SelectableListDefaultValueProvider(PatientChartNodeType.TobaccoHistoryNode,
                    Guid.Parse(LibraryEntityIds.LibrarySelectableLists.TobaccoUseStatus),
                    x.GetRequiredService<ISelectableListRepository>()));

            services.AddScoped<IDefaultValueProvider>(x
                => new SelectableListDefaultValueProvider(PatientChartNodeType.DrugHistoryNode,
                    Guid.Parse(LibraryEntityIds.LibrarySelectableLists.DrugUseStatus),
                    x.GetRequiredService<ISelectableListRepository>()));

            services.AddScoped<IDefaultValueProvider>(x
                => new SelectableListDefaultValueProvider(PatientChartNodeType.AlcoholHistoryNode,
                    Guid.Parse(LibraryEntityIds.LibrarySelectableLists.AlcoholUseStatus),
                    x.GetRequiredService<ISelectableListRepository>()));

            services.AddScoped<IDefaultValueProvider>(x
                => new SelectableListDefaultValueProvider(PatientChartNodeType.OccupationalHistoryNode,
                    Guid.Parse(LibraryEntityIds.LibrarySelectableLists.Occupation),
                    x.GetRequiredService<ISelectableListRepository>()));

            services.AddScoped<IDefaultValueProvider>(x
                => new SelectableListDefaultValueProvider(PatientChartNodeType.EducationNode,
                    Guid.Parse(LibraryEntityIds.LibrarySelectableLists.Education),
                    x.GetRequiredService<ISelectableListRepository>()));

            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.PreviousMedicalHistoryNode, unremarkable));
            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.PreviousSurgicalHistoryNode, unremarkable));
            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.FamilyHistoryNode, unremarkable));
            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.ReviewedMedicalRecordsNode, unremarkable));

            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.MedicationsNode, none));
            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.AllergiesNode, "NKDA"));
            services.AddScoped<IDefaultValueProvider>(x =>
                new SimpleDefaultValueProvider(PatientChartNodeType.PrescriptionNode, none));

            // Infra - Identity
            services.AddScoped<IUser, AspNetUser>();
        }
    }
}