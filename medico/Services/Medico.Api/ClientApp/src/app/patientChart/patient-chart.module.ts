import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientChartComponent } from './components/patient-chart/patient-chart.component';
import { PatientChartHeaderComponent } from './components/patient-chart-header/patient-chart-header.component';
import { PatientChartReportComponent } from './components/patient-chart-report/patient-chart-report.component';
import { DxTreeViewModule } from 'devextreme-angular/ui/tree-view';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxPopoverModule } from 'devextreme-angular/ui/popover';
import { PatientChartService } from './services/patient-chart.service';
import { AdmissionService } from './services/admission.service';
import { SignatureInfoService } from './services/signature-info.service';
import { HtmlOutletDirective } from './directives/html-outlet.directive';
import { TobaccoHistoryService } from './patient-chart-tree/services/tobacco-history.service';
import { DrugHistoryService } from './patient-chart-tree/services/drug-history.service';
import { AlcoholHistoryService } from './patient-chart-tree/services/alcohol-history.service';
import { MedicalHistoryService } from './patient-chart-tree/services/medical-history.service';
import { SurgicalHistoryService } from './patient-chart-tree/services/surgical-history.service';
import { FamilyHistoryService } from './patient-chart-tree/services/family-history.service';
import { EducationHistoryService } from './patient-chart-tree/services/education-history.service';
import { OccupationalHistoryService } from './patient-chart-tree/services/occupational-history.service';
import { AllergyService } from './patient-chart-tree/services/allergy.service';
import { MedicationHistoryService } from './patient-chart-tree/services/medication-history.service';
import { MedicalRecordService } from './patient-chart-tree/services/medical-record.service';
import { TemplateContentCheckerService } from './patient-chart-tree/services/template-content-checker.service';
import { TemplateContentService } from './patient-chart-tree/services/template-content.service';
import { VitalSignsService } from './patient-chart-tree/services/vital-signs.service';
import { DocumentService } from './patient-chart-tree/services/document.service';
import { BaseVitalSignsService } from './patient-chart-tree/services/base-vital-signs.service';
import { ShareModule } from '../share/share.module';
import { ReportSectionService } from './services/report-section.service';
import { MedicationPrescriptionService } from './patient-chart-tree/services/medication-prescription.service';
import { MedicationClassService } from './patient-chart-tree/services/medication-class.service';
import { VisionVitalSignsService } from './patient-chart-tree/services/vision-vital-signs.service';
import { AllegationsNotesStatusService } from './patient-chart-tree/services/allegations-notes-status.service';
import { VitalSignsNotesService } from './patient-chart-tree/services/vital-signs-notes.service';
import { PatientChartNodeFiltersService } from './services/patient-chart-node-filters.service';
import { PatientChartReportHeaderService } from './services/patient-chart-report-header.service';
import { PatientChartReportFooterService } from './services/patient-chart-report-footer.service';


@NgModule({
    imports: [
        CommonModule,
        DxScrollViewModule,
        DxTreeViewModule,
        DxPopupModule,
        DxPopoverModule,
        ShareModule
    ],
    declarations: [
        PatientChartComponent,
        PatientChartHeaderComponent,
        PatientChartReportComponent,
        HtmlOutletDirective
    ],
    providers: [
        PatientChartService,
        AdmissionService,
        SignatureInfoService,
        TobaccoHistoryService,
        DrugHistoryService,
        AlcoholHistoryService,
        MedicalHistoryService,
        SurgicalHistoryService,
        FamilyHistoryService,
        EducationHistoryService,
        OccupationalHistoryService,
        AllergyService,
        MedicationHistoryService,
        MedicationPrescriptionService,
        MedicalRecordService,
        TemplateContentCheckerService,
        TemplateContentService,
        VitalSignsService,
        VisionVitalSignsService,
        DocumentService,
        BaseVitalSignsService,
        ReportSectionService,
        MedicationClassService,
        AllegationsNotesStatusService,
        VitalSignsNotesService,
        PatientChartNodeFiltersService,
        PatientChartReportHeaderService,
        PatientChartReportFooterService
    ]
})
export class PatientChartModule { }