import { Injectable } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { OccupationalHistoryService } from '../patient-chart-tree/services/occupational-history.service';
import { EducationHistoryService } from '../patient-chart-tree/services/education-history.service';
import { PatientInsuranceService } from 'src/app/_services/patient-insurance.service';
import { TobaccoHistoryService } from '../patient-chart-tree/services/tobacco-history.service';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { CompanyService } from 'src/app/_services/company.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { DrugHistoryService } from '../patient-chart-tree/services/drug-history.service';
import { AlcoholHistoryService } from '../patient-chart-tree/services/alcohol-history.service';
import { MedicalHistoryService } from '../patient-chart-tree/services/medical-history.service';
import { SurgicalHistoryService } from '../patient-chart-tree/services/surgical-history.service';
import { FamilyHistoryService } from '../patient-chart-tree/services/family-history.service';
import { AllergyService } from '../patient-chart-tree/services/allergy.service';
import { MedicationHistoryService } from '../patient-chart-tree/services/medication-history.service';
import { VitalSignsService } from '../patient-chart-tree/services/vital-signs.service';
import { PatientChartService } from './patient-chart.service';
import { TemplateService } from 'src/app/_services/template.service';
import { SignatureInfoService } from './signature-info.service';
import { MedicalRecordService } from '../patient-chart-tree/services/medical-record.service';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { IReportSection, ReportSectionInfo } from '../components/report-sections/baseHistoryReportSection';
import { ReportSectionNames } from '../classes/reportSectionNames';
import { PatientHeaderSection } from '../components/report-sections/patientHeaderSection';
import { PatientFooterSection } from '../components/report-sections/patientFooterSection';
import { TobaccoHistorySection } from '../components/report-sections/tobaccoHistorySection';
import { DrugHistorySection } from '../components/report-sections/drugHistorySection';
import { AlcoholHistorySection } from '../components/report-sections/alcoholHistorySection';
import { PreviousMedicalHistorySection } from '../components/report-sections/previousMedicalHistorySection';
import { PreviousSurgicalHistorySection } from '../components/report-sections/previousSurgicalHistorySection';
import { FamilyHistorySection } from '../components/report-sections/familyHistorySection';
import { EducationSection } from '../components/report-sections/educationSection';
import { OccupationalHistorySection } from '../components/report-sections/occupationalHistorySection';
import { ReviewedMedicalRecordsSection } from '../components/report-sections/reviewedMedicalRecordsSection';
import { AllergiesSection } from '../components/report-sections/allergiesSection';
import { MedicationsSection } from '../components/report-sections/medicationsSection';
import { ChiefComplaintSection } from '../components/report-sections/chiefComplaintSection';
import { VitalSignsSection } from '../components/report-sections/vitalSignsSection';
import { BaseVitalSignsService } from '../patient-chart-tree/services/base-vital-signs.service';
import { ProcedureSection } from '../components/report-sections/procedureSection';
import { AssessmentSection } from '../components/report-sections/assessmentSection';
import { PlanSection } from '../components/report-sections/planSection';
import { HpiSection } from '../components/report-sections/hpiSection';
import { RosSection } from '../components/report-sections/rosSection';
import { PhysicalExamSection } from '../components/report-sections/physicalExamSection';
import { TemplateSection } from '../components/report-sections/templateSection';
import { AlertService } from 'src/app/_services/alert.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { PrescriptionSection } from '../components/report-sections/prescriptionSection';
import { MedicationPrescriptionService } from '../patient-chart-tree/services/medication-prescription.service';

@Injectable()
export class ReportSectionService {
    private _registeredReportSections: { [id: string]: IReportSection; } = {};

    constructor(private patientService: PatientService,
        private occupationalHistoryService: OccupationalHistoryService,
        private educationHistoryService: EducationHistoryService,
        private patientInsuranceService: PatientInsuranceService,
        private tobaccoHistoryService: TobaccoHistoryService,
        private companyIdService: CompanyIdService,
        private companyService: CompanyService,
        private appointmentService: AppointmentService,
        private drugHistoryService: DrugHistoryService,
        private alcoholHistoryService: AlcoholHistoryService,
        private medicalHistoryService: MedicalHistoryService,
        private surgicalHistoryService: SurgicalHistoryService,
        private familyHistoryService: FamilyHistoryService,
        private allergyService: AllergyService,
        private medicationHistoryService: MedicationHistoryService,
        private vitalSignsService: VitalSignsService,
        private patientChartService: PatientChartService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private defaultValueService: DefaultValueService,
        private medicalRecordService: MedicalRecordService,
        private signatureInfoService: SignatureInfoService,
        private baseVitalSignsService: BaseVitalSignsService,
        private alertService: AlertService,
        private selectableListService: SelectableListService,
        private medicationPrescriptionService: MedicationPrescriptionService) {

        this.registerReportSections();
    }

    getReportSectionHtml(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const sectionName = reportSectionInfo.templateName
            ? ReportSectionNames.templateSection
            : reportSectionInfo.sectionName;

        const reportSection = this._registeredReportSections[sectionName];

        if (!reportSection) {
            return Promise.resolve("");
        }

        return reportSection
            .getHtmlString(reportSectionInfo);
    }

    private registerReportSections(): void {
        this.registerReportSection(ReportSectionNames.patientHeader,
            new PatientHeaderSection(this.patientService,
                this.patientInsuranceService, this.companyIdService, this.companyService,
                this.appointmentService));

        this.registerReportSection(ReportSectionNames.patientFooter,
            new PatientFooterSection(this.signatureInfoService));

        this.registerPatientHistorySections();

        this.registerReportSection(ReportSectionNames.chiefComplaint,
            new ChiefComplaintSection(this.patientChartService));

        this.registerReportSection(ReportSectionNames.vitalSigns,
            new VitalSignsSection(this.vitalSignsService, this.baseVitalSignsService));

        this.registerReportSection(ReportSectionNames.procedure, new ProcedureSection());

        this.registerReportSection(ReportSectionNames.assessment, new AssessmentSection(this.patientChartService));

        this.registerReportSection(ReportSectionNames.plan, new PlanSection());

        this.registerReportSection(ReportSectionNames.hpiSection, new HpiSection());

        this.registerReportSection(ReportSectionNames.templateSection,
            new TemplateSection(this.patientChartService,
                this.selectableItemHtmlService, this.selectableListService, this.alertService));

        this.registerReportSection(ReportSectionNames.rosSection, new RosSection());

        this.registerReportSection(ReportSectionNames.physicalExamSection, new PhysicalExamSection());
    }

    private registerReportSection(sectionName: string, reportSection: IReportSection): void {
        this._registeredReportSections[sectionName] = reportSection;
    }

    private registerPatientHistorySections(): void {
        this.registerReportSection(ReportSectionNames.tobaccoHistory,
            new TobaccoHistorySection(this.tobaccoHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.drugHistory,
            new DrugHistorySection(this.drugHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.alcoholHistory,
            new AlcoholHistorySection(this.alcoholHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.previousMedicalHistory,
            new PreviousMedicalHistorySection(this.medicalHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.previousSurgicalHistory,
            new PreviousSurgicalHistorySection(this.surgicalHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.familyHistory,
            new FamilyHistorySection(this.familyHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.education,
            new EducationSection(this.educationHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.occupationalHistory,
            new OccupationalHistorySection(this.occupationalHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.allergies,
            new AllergiesSection(this.allergyService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.medications,
            new MedicationsSection(this.medicationHistoryService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.reviewedMedicalRecords,
            new ReviewedMedicalRecordsSection(this.medicalRecordService, this.defaultValueService));

        this.registerReportSection(ReportSectionNames.prescriptionSection,
            new PrescriptionSection(this.medicationPrescriptionService, this.defaultValueService));
    }
}