import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { DxTreeViewModule, DxTabsModule, DxFormModule, DxButtonModule, DxDataGridModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxCheckBoxModule, DxListModule, DxNumberBoxModule, DxRadioGroupModule, DxTextBoxModule, DxFileUploaderModule, DxContextMenuModule } from 'devextreme-angular';
import { CompanyManagementComponent } from './components/companyManagement/company-management.component';
import { CompanyComponent } from './components/companyManagement/company/company.component';
import { DxiItemModule } from 'devextreme-angular/ui/nested/item-dxi';
import { HttpClientModule } from '@angular/common/http';
import { CompanyService } from '../_services/company.service';
import { LocationService } from './services/location.service';
import { LocationComponent } from './components/companyManagement/location/location.component';
import { RoomComponent } from './components/companyManagement/room/room.component';
import { RoomService } from './services/room.service';
import { MedicoApplicationUserComponent } from './components/companyManagement/medico-application-user/medico-application-user.component';
import { UserService } from './services/user.service';
import { ShareModule } from '../share/share.module';
import { RoleComponent } from './components/companyManagement/role/role.component';
import { TemplateManagementComponent } from './components/templateManagement/template-management.component';
import { SelectableListCategoryComponent } from './components/templateManagement/selectable-list-category/selectable-list-category.component';
import { SelectableListComponent } from './components/templateManagement/selectable-list/selectable-list.component';
import { TemplateTypeComponent } from './components/templateManagement/template-type/template-type.component';
import { TemplateMappingComponent } from './components/templateManagement/template-mapping/template-mapping.component';
import { KeywordIcdCodeMappingComponent } from './components/templateManagement/keyword-icd-code-mapping/keyword-icd-code-mapping.component';
import { AdminTemplateComponent } from './components/templateManagement/admin-template/admin-template.component';
import { SelectableListCategoryService } from './services/selectable-list-category.service';
import { SelectabeListValuesComponent } from './components/templateManagement/selectable-list/selectabe-list-values/selectabe-list-values.component';
import { SelectableListService } from '../_services/selectable-list.service';
import { SelectableListTrackService } from './services/selectable-list.-track.service';
import { TemplateTypeService } from './services/template-type.service';
import { AdminSelectableListComponent } from './components/templateManagement/admin-template/admin-selectable-list/admin-selectable-list.component';
import { AdminSelectableRangeComponent } from './components/templateManagement/admin-template/admin-selectable-range/admin-selectable-range.component';
import { AdminSelectableDateComponent } from './components/templateManagement/admin-template/admin-selectable-date/admin-selectable-date.component';
import { DetailedTemplatePreviewComponent } from './components/templateManagement/admin-template/detailed-template-preview/detailed-template-preview.component';
import { AdminSelectableRootComponent } from './components/templateManagement/admin-template/admin-selectable-root/admin-selectable-root.component';
import { AdminRichTextEditorComponent } from './components/templateManagement/admin-template/admin-rich-text-editor/admin-rich-text-editor.component';
import {NgxMaskModule} from 'ngx-mask'
import { MedicationManagementComponent } from './components/medicationManagement/medication-management.component';
import { MedicationUpdateService } from './services/medication-update.service';
import { PhraseComponent } from './components/templateManagement/phrase/phrase.component';
import { PhraseService } from './services/phrase.service';
import { PatientChartManagementComponent } from './components/patientChartManagement/patient-chart-management.component';
import { PatientChartContextMenuService } from './services/patient-chart-context-menu.service';
import { ChartSectionManagementComponent } from './components/patientChartManagement/chart-section-management/chart-section-management.component';
import { ChartTemplateManagementComponent } from './components/patientChartManagement/chart-template-management/chart-template-management.component';
import { ChartTemplateListManagementComponent } from './components/patientChartManagement/chart-template-list-management/chart-template-list-management.component';

@NgModule({
    imports: [
        ShareModule,
        CommonModule,
        DxTreeViewModule,
        DxTabsModule,
        DxFormModule,
        DxiItemModule,
        DxButtonModule,
        HttpClientModule,
        DxDataGridModule,
        DxPopupModule,
        DxScrollViewModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxListModule,
        DxNumberBoxModule,
        DxRadioGroupModule,
        DxTextBoxModule,
        NgxMaskModule.forRoot(),
        DxFileUploaderModule,
        DxContextMenuModule
    ],
    declarations: [
        AdminComponent,
        CompanyManagementComponent,
        CompanyComponent,
        LocationComponent,
        RoomComponent,
        MedicoApplicationUserComponent,
        RoleComponent,
        TemplateManagementComponent,
        SelectableListCategoryComponent,
        SelectableListComponent,
        AdminTemplateComponent,
        TemplateTypeComponent,
        TemplateMappingComponent,
        KeywordIcdCodeMappingComponent,
        SelectabeListValuesComponent,
        AdminSelectableListComponent,
        AdminSelectableRangeComponent,
        AdminSelectableDateComponent,
        AdminSelectableRootComponent,
        DetailedTemplatePreviewComponent,
        AdminRichTextEditorComponent,
        MedicationManagementComponent,
        PhraseComponent,
        PatientChartManagementComponent,
        ChartSectionManagementComponent,
        ChartTemplateManagementComponent,
        ChartTemplateListManagementComponent
    ],
    providers: [
        CompanyService,
        LocationService,
        RoomService,
        UserService,
        SelectableListCategoryService,
        SelectableListService,
        SelectableListTrackService,
        TemplateTypeService,
        MedicationUpdateService,
        PhraseService,
        PatientChartContextMenuService
    ]
})
export class AdministrationModule { }