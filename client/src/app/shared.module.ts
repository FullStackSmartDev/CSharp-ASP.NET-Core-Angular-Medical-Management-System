import { BrowserModule } from '@angular/platform-browser';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DxSchedulerModule, DxListModule, DxTreeViewModule, DxDataGridModule, DxButtonModule, DxTextBoxModule, DxDateBoxModule, DxDropDownBoxModule, DxAutocompleteModule, DxPopupModule, DxSelectBoxModule, DxNumberBoxModule, DxLookupModule, DxSwitchModule, DxCheckBoxModule, DxTextAreaModule, DxValidatorModule, DxLoadPanelModule, DxValidationGroupModule, DxRadioGroupModule, DxScrollViewModule, DxTileViewModule, DxTabPanelModule, DxTabsModule, DxAccordionModule, DxPopoverModule, DxFormModule } from 'devextreme-angular';
import { HttpModule } from '@angular/http';
import { ParagraphTemplateComponent } from '../components/paragraphTemplateComponent/paragraphTemplateComponent';
import { SafeHtmlPipe } from '../pipe/safeHtmlPipe';
import { VitalSignsComponent } from '../components/vitalSignsComponent/vitalSignsComponent'
import { ChiefComplaintComponent } from '../components/chiefComplaint/chiefComplaintComponent';
import { PreviousMedicalHistoryComponent } from '../components/patientHistory/previousMedicalHistory/previousMedicalHistoryComponent';
import { PreviousSurgicalHistoryComponent } from '../components/patientHistory/previousSurgicalHistory/previousSurgicalHistoryComponent';
import { FamilyHistoryComponent } from '../components/patientHistory/familyHistory/familyHistoryComponent';
import { EducationHistoryComponent } from '../components/patientHistory/educationHistory/educationHistoryComponent';
import { OccupationalHistoryComponent } from '../components/patientHistory/occupationalHistory/occupationalHistoryComponent';
import { AllergyComponent } from '../components/patientHistory/allergy/allergyComponent';
import { MedicationHistoryComponent } from '../components/patientHistory/medicationHistory/medicationHistoryComponent';
import { AppointmentLastVisitDateComponent } from '../components/appointmentLastVisitDateComponent/appointmentLastVisitDateComponent';
import { DayBusynessComponent } from '../components/dayBusynessComponent/dayBusynessComponent';
import { AssessmentComponent } from '../components/assessment/assessment';
import { AdminSelectableRootComponent } from '../components/templateSelectableItemsManagement/admin/adminSelectableRootComponent/adminSelectableRootComponent';
import { AdminSelectableListComponent } from '../components/templateSelectableItemsManagement/admin/adminSelectableListComponent/adminSelectableListComponent';
import { AdminSelectableRangeComponent } from '../components/templateSelectableItemsManagement/admin/adminSelectableRangeComponent/adminSelectableRangeComponent';
import { AdminSelectableDateComponent } from '../components/templateSelectableItemsManagement/admin/adminSelectableDateComponent/adminSelectableDateComponent';
import { PatientSelectableRootComponent } from '../components/templateSelectableItemsManagement/patient/patientSelectableRootComponent/patientSelectableRootComponent';
import { PatientSelectableListComponent } from '../components/templateSelectableItemsManagement/patient/patientSelectableListComponent/patientSelectableListComponent';
import { PatientSelectableRangeComponent } from '../components/templateSelectableItemsManagement/patient/patientSelectableRangeComponent/patientSelectableRangeComponent';
import { PatientSelectableDateComponent } from '../components/templateSelectableItemsManagement/patient/patientSelectableDateComponent/patientSelectableDateComponent';
import { TemplateListComponent } from '../components/templateSelectableItemsManagement/common/templateListComponent/templateListComponent';
import { TemplateTypeLookupComponent } from '../components/lookups/templateTypeLookupComponent/templateTypeLookupComponent';
import { AllegationsRelatedChiefComplaintsComponent } from '../components/chiefComplaint/allegationsRelatedChiefComplaintsComponent';
import { TobaccoHistoryComponent } from '../components/patientHistory/tobaccoHistory/tobaccoHistoryComponent';
import { DrugHistoryComponent } from '../components/patientHistory/drugHistory/drugHistoryComponent';
import { AlcoholHistoryComponent } from '../components/patientHistory/alcoholHistory/alcoholHistoryComponent';
import { BaseVitalSignsComponent } from '../components/baseVitalSigns/baseVitalSignsComponent';
import { TimePipe, AgePipe } from '../pipe/timePipe';
import { DatePipe } from '../pipe/timePipe';
import { UsPhonePipe } from '../pipe/usPhonePipe';
import { MatchedChiefComplaintKeywordsComponent } from '../components/chiefComplaint/matchedChiefComplaintKeywordsComponent';
import { AddMissedKeywordsComponent } from '../components/chiefComplaint/addMissedKeywordsComponent';
import { AllChiefComplaintKeywords } from '../components/chiefComplaint/allChiefComplaintKeywords';
import { NewChiefComplaintMapping } from '../components/chiefComplaint/newChiefComplaintMapping';
import { TemplateAddComponent } from '../components/chiefComplaint/templateAddComponent';
import { KeywordAddComponent } from '../components/chiefComplaint/keywordAddComponent';
import { TemplatesAddComponent } from '../components/chiefComplaint/templatesAddComponent';
import { DetailedTemplatePreviewComponent } from '../components/management/detailedTemplatePreviewComponent';
import { PatientChartHeaderComponent } from '../components/patientChartHeader/patientChartHeaderComponent';
import { InternetConnectionTrackComponent } from '../components/InternetConnectionTrackComponent/InternetConnectionTrackComponent';
import { AdminRichTextEditorComponent } from '../components/templateSelectableItemsManagement/base/adminRichTextEditorComponent';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PatientRichTextEditorComponent } from '../components/templateSelectableItemsManagement/base/patientRichTextEditorComponent';
import { ExtraFieldsTabComponent } from '../components/companyAdministration/extraFieldsTabComponent';
import { AddendumComponent } from '../components/patientHistory/addendum/addendumComponent';
import { NotSetPipe } from '../pipe/notSetPipe';
import { ReportComponent } from '../components/reportComponent/reportComponent';
import { ReviewedMedicalRecordsComponent } from '../components/patientHistory/reviewedMedicalRecords/reviewedMedicalRecordsComponent';
import { HttpClientModule } from '@angular/common/http';
import { KeywordIcdCodeMapComponent } from '../components/management/keywordIcdCodeMapComponent';
import { AppointmentAllegationsComponent } from '../components/appointmentAllegationsComponent/appointmentAllegationsComponent';
import { ChiefComplaintAllegationsComponent } from '../components/chiefComplaint/chiefComplaintAllegationsComponent';

@NgModule({
    imports: [
        HttpClientModule,
        EditorModule,
        DxListModule,
        DxTileViewModule,
        DxSchedulerModule,
        DxTreeViewModule,
        DxDataGridModule,
        DxButtonModule,
        DxTextBoxModule,
        DxDropDownBoxModule,
        DxDateBoxModule,
        DxAutocompleteModule,
        BrowserModule,
        IonicModule,
        HttpModule,
        SelectSearchableModule,
        DxPopupModule,
        DxSelectBoxModule,
        DxNumberBoxModule,
        DxLookupModule,
        DxSwitchModule,
        DxCheckBoxModule,
        DxTextAreaModule,
        DxValidatorModule,
        DxLoadPanelModule,
        DxValidationGroupModule,
        DxRadioGroupModule,
        DxScrollViewModule,
        DxTabPanelModule,
        DxTabsModule,
        DxAccordionModule,
        DxPopoverModule,
        DxFormModule
    ],
    declarations: [
        ChiefComplaintAllegationsComponent,
        AppointmentAllegationsComponent,
        KeywordIcdCodeMapComponent,
        ReviewedMedicalRecordsComponent,
        ReportComponent,
        NotSetPipe,
        AddendumComponent,
        PatientRichTextEditorComponent,
        AdminRichTextEditorComponent,
        AddMissedKeywordsComponent,
        SafeHtmlPipe,
        TimePipe,
        DatePipe,
        AgePipe,
        UsPhonePipe,
        ParagraphTemplateComponent,
        VitalSignsComponent,
        ChiefComplaintComponent,
        PreviousMedicalHistoryComponent,
        PreviousSurgicalHistoryComponent,
        FamilyHistoryComponent,
        EducationHistoryComponent,
        OccupationalHistoryComponent,
        AllergyComponent,
        MedicationHistoryComponent,
        AppointmentLastVisitDateComponent,
        DayBusynessComponent,
        AssessmentComponent,
        AdminSelectableRootComponent,
        AdminSelectableListComponent,
        AdminSelectableRangeComponent,
        AdminSelectableDateComponent,
        PatientSelectableRootComponent,
        PatientSelectableListComponent,
        PatientSelectableRangeComponent,
        PatientSelectableDateComponent,
        TemplateListComponent,
        TemplateTypeLookupComponent,
        AllegationsRelatedChiefComplaintsComponent,
        TobaccoHistoryComponent,
        DrugHistoryComponent,
        AlcoholHistoryComponent,
        BaseVitalSignsComponent,
        MatchedChiefComplaintKeywordsComponent,
        AllChiefComplaintKeywords,
        NewChiefComplaintMapping,
        TemplateAddComponent,
        KeywordAddComponent,
        TemplatesAddComponent,
        DetailedTemplatePreviewComponent,
        PatientChartHeaderComponent,
        InternetConnectionTrackComponent,
        ExtraFieldsTabComponent
    ],
    exports: [
        ChiefComplaintAllegationsComponent,
        AppointmentAllegationsComponent,
        KeywordIcdCodeMapComponent,
        ReviewedMedicalRecordsComponent,
        ReportComponent,
        NotSetPipe,
        AddendumComponent,
        ExtraFieldsTabComponent,
        EditorModule,
        AgePipe,
        DxPopoverModule,
        InternetConnectionTrackComponent,
        PatientChartHeaderComponent,
        DetailedTemplatePreviewComponent,
        TemplatesAddComponent,
        KeywordAddComponent,
        TemplateAddComponent,
        NewChiefComplaintMapping,
        AllChiefComplaintKeywords,
        AddMissedKeywordsComponent,
        DxTabsModule,
        MatchedChiefComplaintKeywordsComponent,
        UsPhonePipe,
        TimePipe,
        BaseVitalSignsComponent,
        AlcoholHistoryComponent,
        DrugHistoryComponent,
        TobaccoHistoryComponent,
        TemplateTypeLookupComponent,
        PatientSelectableDateComponent,
        PatientSelectableRangeComponent,
        AdminSelectableDateComponent,
        DxRadioGroupModule,
        DxScrollViewModule,
        DxAccordionModule,
        DxTabPanelModule,
        AssessmentComponent,
        DayBusynessComponent,
        AppointmentLastVisitDateComponent,
        MedicationHistoryComponent,
        AllergyComponent,
        OccupationalHistoryComponent,
        EducationHistoryComponent,
        FamilyHistoryComponent,
        PreviousMedicalHistoryComponent,
        SafeHtmlPipe,
        ParagraphTemplateComponent,
        PreviousSurgicalHistoryComponent,
        VitalSignsComponent,
        ChiefComplaintComponent,
        AdminSelectableRootComponent,
        AdminSelectableListComponent,
        AdminSelectableRangeComponent,
        PatientSelectableRootComponent,
        PatientSelectableListComponent,
        TemplateListComponent,
        AllegationsRelatedChiefComplaintsComponent,
        AdminRichTextEditorComponent,
        PatientRichTextEditorComponent
    ]
})

export class SharedModule { }