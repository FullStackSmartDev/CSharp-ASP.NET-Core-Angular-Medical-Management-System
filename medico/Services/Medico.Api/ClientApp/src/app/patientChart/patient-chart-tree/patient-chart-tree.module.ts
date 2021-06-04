import { NgModule } from '@angular/core';
import { TobaccoHistoryComponent } from './components/patient-history/tobacco-history/tobacco-history.component';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxRadioGroupModule, DxPopoverModule, DxSelectBoxModule, DxListModule, DxTextAreaModule, DxTabsModule, DxButtonModule, DxFileUploaderModule, DxValidatorModule, DxTextBoxModule, DxTabPanelModule } from 'devextreme-angular';
import { WebcamModule } from 'ngx-webcam';
import { ToastUiImageEditorModule } from "ngx-tui-image-editor";
import { DrugHistoryComponent } from './components/patient-history/drug-history/drug-history.component';
import { AlcoholHistoryComponent } from './components/patient-history/alcohol-history/alcohol-history.component';
import { MedicalHistoryComponent } from './components/patient-history/medical-history/medical-history.component';
import { SurgicalHistoryComponent } from './components/patient-history/surgical-history/surgical-history.component';
import { FamilyHistoryComponent } from './components/patient-history/family-history/family-history.component';
import { EducationHistoryComponent } from './components/patient-history/education-history/education-history.component';
import { OccupationalHistoryComponent } from './components/patient-history/occupational-history/occupational-history.component';
import { AllergyComponent } from './components/patient-history/allergy/allergy.component';
import { MedicationHistoryComponent } from './components/patient-history/medication-history/medication-history.component';
import { ReviewedMedicalRecordsComponent } from './components/patient-history/reviewed-medical-records/reviewed-medical-records.component';
import { ShareModule } from 'src/app/share/share.module';
import { PatientRichTextEditorComponent } from './components/patient-rich-text-editor/patient-rich-text-editor.component';
import { PatientChartTemplateComponent } from './components/patient-chart-template/patient-chart-template.component';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { ChiefComplaintComponent } from './components/chief-complaint-chart-section/chief-complaint/chief-complaint.component';
import { PatientAllegationsComponent } from './components/chief-complaint-chart-section/patient-allegations/patient-allegations.component';
import { MissedKeywordsComponent } from './components/chief-complaint-chart-section/chief-complaint-management/chief-complaint-map-keywords/missed-keywords.component';
import { ChiefComplaintKeywordsComponent } from './components/chief-complaint-chart-section/chief-complaint-management/chief-complaint-keywords/chief-complaint-keywords.component';
import { ChiefComplaintManagementComponent } from './components/chief-complaint-chart-section/chief-complaint-management/chief-complaint-management.component';
import { ChiefComplaintMapKeywordsComponent } from './components/chief-complaint-chart-section/chief-complaint-management/chief-complaint-map-keywords/map-keywords.component';
import { AddTemplatesComponent } from './components/chief-complaint-chart-section/chief-complaint-management/add-templates/add-templates.component';
import { NewTemplateMappingComponent } from './components/chief-complaint-chart-section/chief-complaint-management/new-template-mapping/new-template-mapping.component';
import { VitalSignsComponent } from './components/vital-signs/vital-signs.component';
import { BaseVitalSignsComponent } from './components/base-vital-signs/base-vital-signs.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { ScanDocumentComponent } from './components/scan-document/scan-document.component';
import { MedicationPrescriptionComponent } from './components/medication-prescription/medication-prescription.component';
import { VisionVitalSignsComponent } from './components/vision-vital-signs/vision-vital-signs.component';
import { AllegationsNotesStatusComponent } from './components/chief-complaint-chart-section/allegations-notes-status/allegations-notes-status.component';
import { PhraseSuggestionHelperComponent } from './components/phrase-suggestion-helper/phrase-suggestion-helper.component';
import { VitalSignsNotesComponent } from './components/vital-signs-notes/vital-signs-notes.component';
import { AddendumComponent } from './components/addendum/addendum.component';
import { ExistedTemplateMappingComponent } from './components/chief-complaint-chart-section/chief-complaint-management/existed-template-mapping/existed-template-mapping.component';
import { ReportNodeViewComponent } from './components/report-node-view/report-node-view.component';
import { PatientTemplateEditorComponent } from './components/patient-template-editor/patient-template-editor.component';
import { TemplateManualEditorComponent } from './components/template-manual-editor/template-manual-editor.component';

@NgModule({
    imports: [
        CommonModule,
        DxDataGridModule,
        DxSelectBoxModule,
        DxFormModule,
        DxPopupModule,
        DxRadioGroupModule,
        DxPopoverModule,
        DxListModule,
        DxTextAreaModule,
        DxTabsModule,
        DxButtonModule,
        ShareModule,
        DxFileUploaderModule,
        WebcamModule,
        ToastUiImageEditorModule,
        DxTabPanelModule
    ],
    declarations: [
        MedicationPrescriptionComponent,
        TobaccoHistoryComponent,
        DrugHistoryComponent,
        AlcoholHistoryComponent,
        MedicalHistoryComponent,
        SurgicalHistoryComponent,
        FamilyHistoryComponent,
        EducationHistoryComponent,
        OccupationalHistoryComponent,
        AllergyComponent,
        MedicationHistoryComponent,
        ReviewedMedicalRecordsComponent,
        PatientRichTextEditorComponent,
        PatientChartTemplateComponent,
        TemplateListComponent,
        ChiefComplaintComponent,
        PatientAllegationsComponent,
        ChiefComplaintManagementComponent,
        ChiefComplaintMapKeywordsComponent,
        MissedKeywordsComponent,
        AddTemplatesComponent,
        ChiefComplaintKeywordsComponent,
        NewTemplateMappingComponent,
        VitalSignsComponent,
        BaseVitalSignsComponent,
        AssessmentComponent,
        ScanDocumentComponent,
        VisionVitalSignsComponent,
        AllegationsNotesStatusComponent,
        PhraseSuggestionHelperComponent,
        VitalSignsNotesComponent,
        AddendumComponent,
        ExistedTemplateMappingComponent,
        ReportNodeViewComponent,
        PatientTemplateEditorComponent,
        TemplateManualEditorComponent
    ],
    providers: [],
    exports: [
        MedicationPrescriptionComponent,
        TobaccoHistoryComponent,
        DrugHistoryComponent,
        AlcoholHistoryComponent,
        MedicalHistoryComponent,
        SurgicalHistoryComponent,
        FamilyHistoryComponent,
        EducationHistoryComponent,
        OccupationalHistoryComponent,
        AllergyComponent,
        MedicationHistoryComponent,
        ReviewedMedicalRecordsComponent,
        PatientRichTextEditorComponent,
        PatientChartTemplateComponent,
        TemplateListComponent,
        ChiefComplaintComponent,
        PatientAllegationsComponent,
        ChiefComplaintManagementComponent,
        ChiefComplaintMapKeywordsComponent,
        MissedKeywordsComponent,
        AddTemplatesComponent,
        ChiefComplaintKeywordsComponent,
        NewTemplateMappingComponent,
        VitalSignsComponent,
        BaseVitalSignsComponent,
        AssessmentComponent,
        ScanDocumentComponent,
        AllegationsNotesStatusComponent,
        PhraseSuggestionHelperComponent,
        AddendumComponent,
        ReportNodeViewComponent
    ]
})
export class PatientChartTreeModule { }