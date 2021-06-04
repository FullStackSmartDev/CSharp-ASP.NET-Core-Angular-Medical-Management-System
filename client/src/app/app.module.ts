import { BrowserModule } from '@angular/platform-browser';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DxSchedulerModule, DxScrollViewModule, DxListModule, DxTreeViewModule, DxDataGridModule, DxButtonModule, DxTextBoxModule, DxDateBoxModule, DxDropDownBoxModule, DxAutocompleteModule, DxPopupModule, DxSelectBoxModule, DxNumberBoxModule, DxCheckBoxModule, DxLoadIndicatorModule, DxLoadPanelModule, DxLookupModule, DxFormModule, DxBoxModule, DxValidatorModule, DxTreeListModule, DxTextAreaModule, DxValidationGroupModule } from 'devextreme-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { AdministrationPage } from '../pages/administration/administration';
import { PatientDataPage } from '../pages/patientData/patientData';
import { AppointmentsPage } from '../pages/appointments/appointmentsComponent';
import { HttpModule } from '@angular/http';
import { HtmlOutlet } from '../directive/htmlOutletDirective';
import { LoginPage } from '../pages/login/login';
import { AuthorizationService } from '../provider/authorizationService';
import { PatienDataModelService } from '../provider/patienDataModelService';
import { SharedModule } from './shared.module';
import { SyncService } from '../provider/syncService';
import { StringHelper } from '../helpers/stringHelper';
import { ObjectHelpers } from '../helpers/objectHelpers';
import { SqlQueryBuilder } from '../provider/sqlQueryBuilder';
import { DataService } from '../provider/dataService';
import { ReportPage } from '../pages/report/report';
import { ReportGeneratorService } from '../provider/reportGeneratorService';
import { PatientDataModelTrackService } from '../provider/patientDataModelTrackService';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { TemplateLookupItemCategoryManagement } from '../components/management/templateLookupItemCategoryManagement';
import { TemplateManagementComponent } from '../components/management/templateManagementComponent';
import { TemplateLookupItemManagement } from '../components/management/templateLookupItemManagement';
import { DxiItemModule } from '../../node_modules/devextreme-angular/ui/nested/item-dxi';
import { TemplateCreationComponent } from '../components/management/templateCreationComponent';
import { TemplateMappingComponent } from '../components/management/templateMappingComponent';
import { LookupDataSourceProvider } from '../provider/lookupDataSourceProvider';
import { CryptoService } from '../provider/cryptoService';
import { PermissionGroupComponent } from '../components/management/permissionGroup';
import { CompanyAdministrationComponent } from '../components/companyAdministration/companyAdministrationComponent';
import { CompanyFormComponent } from '../components/companyAdministration/companyFormComponent';
import { CompanyIdService } from '../provider/companyIdService';
import { LocationManagementComponent } from '../components/companyAdministration/locationManagementComponent';
import { ToastService } from '../provider/toastService';
import { RoomManagementComponent } from '../components/companyAdministration/roomManagementComponent';
import { EmployeeManagementComponent } from '../components/companyAdministration/employeeManagementComponent';
import { ExtraFieldManagementComponent } from '../components/management/extraFieldManagementComponent';
import { PatientManagementPage } from '../pages/patientManagementPage/patientManagementPage';
import { SyncComponent } from '../components/syncComponent/syncComponent';
import { DataSynchronizationService } from '../provider/dataSynchronizationService';
import { SelectableItemHtmlService } from '../provider/selectableItemHtmlService';
import { TemplateTypeManagementComponent } from '../components/management/templateTypeManagementComponent';
import { EntityNameService } from '../provider/entityNameService';
import { SqlValuesProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/sqlValuesProvider';
import { SqlFilterExpressionConverter } from '../provider/sqlDataSource/sqlFilterExpressionConverter';
import { SqlFilterConverter } from '../provider/sqlDataSource/sqlFilterConverter';
import { SqlSortConverter } from '../provider/sqlDataSource/sqlSortConverter';
import { SelectSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/selectSqlStringProvider';
import { UpdateSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/updateSqlStringProvider';
import { InsertSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/insertSqlStringProvider';
import { LoadPanelService } from '../provider/loadPanelService';
import { AlertService } from '../provider/alertService';
import { TemplateLookupItemViewDataService, CptCodeReadDataService, AppointmentGridViewDataService, PatientAdmissionViewDataService, ChiefComplaintKeywordsViewDataService, TemplateLookupItemTrackerViewDataService, ExtraFieldViewDataService, RoomViewDataService, UserPermissionGroupViewDataService, EmployeeWithPermissionGroupViewDataService } from '../provider/dataServices/read/readDataServices';
import { LookupItemListComponent } from '../components/management/lookupItemListComponent';
import { TemplateTypeDataService, CategoryDataService, TemplateLookupItemDataService, TemplateDataService, TobaccoHistoryDataService, DrugHistoryDataService, AlcoholHistoryDataService, MedicalHistoryDataService, SurgicalHistoryDataService, FamilyHistoryDataService, EducationHistoryDataService, OccupationalHistoryDataService, AllergyDataService, MedicationHistoryDataService, AppointmentDataService, LocationDataService, PatientDemographicDataService, RoomDataService, EmployeeDataService, VitalSignsDataService, BaseVitalSignsDataService, PatientInsuranceDataService, ChiefComplaintKeywordDataService, ChiefComplaintRelatedKeywordDataService, ChiefComplaintDataService, ChiefComplaintTemplateDataService, TemplateLookupItemTrackerDataService, CompanyDataService, ExtraFieldDataService, EntityExtraFieldMapDataService, AppUserDataService, PermissionGroupDataService, AppUserPermissionGroupDataService, AdmissionDataService, AddendumDataService, MedicalRecordDataService, SignatureInfoDataService } from '../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { TemplateTypeTable, TemplateLookupItemCategoryTable, TemplateLookupItemTable, TemplateTable, TobaccoHistoryTable, DrugHistoryTable, AlcoholHistoryTable, MedicalHistoryTable, SurgicalHistoryTable, FamilyHistoryTable, EducationHistoryTable, OccupationalHistoryTable, AllergyTable, MedicationHistoryTable, AppointmentTable, LocationTable, PatientDemographicTable, RoomTable, EmployeeTable, VitalSignsTable, BaseVitalSignsTable, PatientInsuranceTable, ChiefComplaintKeywordTable, ChiefComplaintRelatedKeywordTable, ChiefComplaintTable, ChiefComplaintTemplateTable, TemplateLookupItemTrackerTable, CompanyTable, ExtraFieldTable, EntityExtraFieldMapTable, AppUserTable, PermissionGroupTable, AppUserPermissionGroupTable, AdmissionTable, AddendumTable, MedicalRecordTable, SignatureInfoTable } from '../provider/sqlDataSource/table/tables';
import { TemplateLookupItemView, CptCodeTableView, AppointmentSqlGridView, PatientAdmissionSqlView, ChiefComplaintKeywordsSqlView, TemplateLookupItemTrackerView, ExtraFieldView, RoomView, UserPermissionGroupView, EmployeeWithPermissionGroupSqlView } from '../provider/sqlDataSource/view/views';
import { TemplateLookupItemValidationDataService } from '../provider/dataServices/read/templateLookupItemValidationDataService';
import { DxAlertService } from '../provider/dxAlertService';
import { AppointmentsFilterComponent } from '../pages/appointments/appointmentsFilterComponent';
import { InternetConnectionTrackService } from '../provider/internetConnectionTrackService';
import { TemplateLookupItemTrackersUpdateService } from '../provider/templateLookupItemTrackersUpdateService';
import { EntityExtraFieldMap } from '../dataModels/entityExtraFieldMap';
import { ExtraFieldsAppService } from '../provider/appServices/extraFieldsAppService';
import { TemplatesContentProvider, TemplatesContentChecker } from '../provider/appServices/templatesWordsChecker';
import { ReportSectionProvider } from '../provider/report/reportSectionProvider';
import { VitalSignsAppService } from '../provider/appServices/vitalSignsAppService';
import { DefaultValuesProvider } from '../provider/defaultValuesProvider';
import { WindowService } from '../provider/windowService';
import { SignatureInfoAppService } from '../provider/appServices/signatureInfoAppService';
import { LookupItemsAppService } from '../provider/appServices/lookupItemsAppService';
import { IcdCodeReadDataService } from '../provider/dataServices/read/IcdCodeReadDataService';
import { MedicationReadDataService } from '../provider/dataServices/read/medicationReadDataService';
import { IcdCodeKeywordsDataService } from '../provider/dataServices/readCreateUpdate/IcdCodeKeywordsDataService';
import { KeywordDataService } from '../provider/dataServices/readCreateUpdate/keywordDataService';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    PatientDataPage,
    ReportPage,
    AppointmentsPage,
    HtmlOutlet,
    LoginPage,
    AdministrationPage,
    TemplateLookupItemCategoryManagement,
    TemplateManagementComponent,
    TemplateLookupItemManagement,
    TemplateCreationComponent,
    TemplateMappingComponent,
    PermissionGroupComponent,
    EmployeeManagementComponent,
    CompanyAdministrationComponent,
    CompanyFormComponent,
    LocationManagementComponent,
    RoomManagementComponent,
    ExtraFieldManagementComponent,
    PatientManagementPage,
    SyncComponent,
    TemplateTypeManagementComponent,
    LookupItemListComponent,
    AppointmentsFilterComponent
  ],
  imports: [
    DxListModule,
    DxSchedulerModule,
    DxTreeViewModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxDropDownBoxModule,
    DxDateBoxModule,
    DxAutocompleteModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SelectSearchableModule,
    DxPopupModule,
    DxSelectBoxModule,
    SharedModule,
    DxScrollViewModule,
    DxNumberBoxModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
    NgJsonEditorModule,
    DxLookupModule,
    DxFormModule,
    DxiItemModule,
    DxButtonModule,
    DxBoxModule,
    DxValidatorModule,
    DxTreeListModule,
    DxTextAreaModule,
    DxValidationGroupModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    PatientDataPage,
    ReportPage,
    AppointmentsPage,
    LoginPage,
    AdministrationPage,
    PatientManagementPage
  ],
  providers: [
    KeywordDataService,
    WindowService,
    DefaultValuesProvider,
    VitalSignsAppService,
    ReportSectionProvider,
    EntityNameService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PatienDataModelService,
    AuthorizationService,
    SyncService,
    StringHelper,
    ObjectHelpers,
    ReportGeneratorService,
    SqlQueryBuilder,
    DataService,
    PatientDataModelTrackService,
    LookupDataSourceProvider,
    CryptoService,
    CompanyIdService,
    ToastService,
    DataSynchronizationService,
    SelectableItemHtmlService,
    TemplateTypeTable,
    TemplateTypeDataService,
    SqlValuesProvider,
    SqlFilterExpressionConverter,
    SqlFilterConverter,
    SqlSortConverter,
    SelectSqlStringProvider,
    UpdateSqlStringProvider,
    InsertSqlStringProvider,
    LoadPanelService,
    AlertService,
    CategoryDataService,
    TemplateLookupItemCategoryTable,
    TemplateLookupItemTable,
    TemplateLookupItemViewDataService,
    TemplateLookupItemDataService,
    TemplateLookupItemView,
    TemplateTable,
    TemplateDataService,
    TemplateLookupItemValidationDataService,
    TobaccoHistoryDataService,
    TobaccoHistoryTable,
    DrugHistoryDataService,
    DrugHistoryTable,
    DrugHistoryDataService,
    AlcoholHistoryDataService,
    AlcoholHistoryTable,
    IcdCodeReadDataService,
    MedicalHistoryTable,
    MedicalHistoryDataService,
    CptCodeTableView,
    CptCodeReadDataService,
    SurgicalHistoryTable,
    SurgicalHistoryDataService,
    FamilyHistoryTable,
    FamilyHistoryDataService,
    EducationHistoryTable,
    EducationHistoryDataService,
    OccupationalHistoryTable,
    OccupationalHistoryDataService,
    AllergyTable,
    AllergyDataService,
    MedicationReadDataService,
    MedicationHistoryTable,
    MedicationHistoryDataService,
    AppointmentSqlGridView,
    AppointmentGridViewDataService,
    AppointmentTable,
    AppointmentDataService,
    LocationTable,
    LocationDataService,
    PatientDemographicTable,
    PatientDemographicDataService,
    RoomTable,
    RoomDataService,
    EmployeeTable,
    EmployeeDataService,
    VitalSignsTable,
    VitalSignsDataService,
    BaseVitalSignsTable,
    BaseVitalSignsDataService,
    LoadPanelService,
    DxAlertService,
    PatientInsuranceTable,
    PatientInsuranceDataService,
    PatientAdmissionSqlView,
    PatientAdmissionViewDataService,
    ChiefComplaintKeywordsSqlView,
    ChiefComplaintKeywordsViewDataService,
    ChiefComplaintKeywordTable,
    ChiefComplaintKeywordDataService,
    ChiefComplaintRelatedKeywordTable,
    ChiefComplaintRelatedKeywordDataService,
    ChiefComplaintTable,
    ChiefComplaintDataService,
    ChiefComplaintTemplateTable,
    ChiefComplaintTemplateDataService,
    InternetConnectionTrackService,
    TemplateLookupItemTrackerTable,
    TemplateLookupItemTrackerDataService,
    TemplateLookupItemTrackerView,
    TemplateLookupItemTrackerViewDataService,
    TemplateLookupItemTrackersUpdateService,
    CompanyTable,
    CompanyDataService,
    ExtraFieldTable,
    ExtraFieldTable,
    ExtraFieldDataService,
    EntityExtraFieldMap,
    EntityExtraFieldMapDataService,
    EntityExtraFieldMapTable,
    ExtraFieldView,
    ExtraFieldViewDataService,
    ExtraFieldsAppService,
    RoomView,
    RoomViewDataService,
    AppUserTable,
    AppUserDataService,
    PermissionGroupTable,
    PermissionGroupDataService,
    UserPermissionGroupView,
    UserPermissionGroupViewDataService,
    EmployeeWithPermissionGroupSqlView,
    EmployeeWithPermissionGroupViewDataService,
    AppUserPermissionGroupTable,
    AppUserPermissionGroupDataService,
    TemplatesContentProvider,
    TemplatesContentChecker,
    AdmissionTable,
    AdmissionDataService,
    AddendumTable,
    AddendumDataService,
    MedicalRecordTable,
    MedicalRecordDataService,
    SignatureInfoTable,
    SignatureInfoDataService,
    SignatureInfoAppService,
    LookupItemsAppService,
    IcdCodeKeywordsDataService
  ]
})
export class AppModule { }
