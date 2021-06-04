import { Injectable } from "@angular/core";
import { ReportSectionNames } from "../../constants/reportSectionNames";
import { PatientDemographicDataService, PatientInsuranceDataService, TobaccoHistoryDataService, CompanyDataService, DrugHistoryDataService, AlcoholHistoryDataService, MedicalHistoryDataService, SurgicalHistoryDataService, FamilyHistoryDataService, EducationHistoryDataService, OccupationalHistoryDataService, AllergyDataService, MedicationHistoryDataService, TemplateDataService, MedicalRecordDataService } from "../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { CompanyIdService } from "../companyIdService";
import { AppointmentGridViewDataService } from "../dataServices/read/readDataServices";
import { PlanSection } from "./sections/planSection";
import { AssessmentSection } from "./sections/assessmentSection";
import { ProcedureSection } from "./sections/procedureSection";
import { VitalSignsSection } from "./sections/vitalSignsSection";
import { ChiefComplaintSection } from "./sections/chiefComplaintSection";
import { ReportSectionInfo, IReportSection } from "./sections/baseHistoryReportSection";
import { MedicationsSection } from "./sections/medicationsSection";
import { AllergiesSection } from "./sections/allergiesSection";
import { DrugHistorySection } from "./sections/drugHistorySection";
import { TobaccoHistorySection } from "./sections/tobaccoHistorySection";
import { PatientHeaderSection } from "./sections/patientHeaderSection";
import { AlcoholHistorySection } from "./sections/alcoholHistorySection";
import { PreviousMedicalHistorySection } from "./sections/previousMedicalHistorySection";
import { PreviousSurgicalHistorySection } from "./sections/previousSurgicalHistorySection";
import { FamilyHistorySection } from "./sections/familyHistorySection";
import { EducationSection } from "./sections/educationSection";
import { OccupationalHistorySection } from "./sections/occupationalHistorySection";
import { VitalSignsAppService } from "../appServices/vitalSignsAppService";
import { TemplateSection } from "./sections/templateSection";
import { PatienDataModelService } from "../patienDataModelService";
import { HpiSection } from "./sections/hpiSection";
import { RosSection } from "./sections/rosSection";
import { PhysicalExamSection } from "./sections/physicalExamSection";
import { DataService } from "../dataService";
import { ToastService } from "../toastService";
import { SelectableItemHtmlService } from "../selectableItemHtmlService";
import { DefaultValuesProvider } from "../defaultValuesProvider";
import { ReviewedMedicalRecordsSection } from "./sections/reviewedMedicalRecordsSection";
import { SignatureInfoAppService } from "../appServices/signatureInfoAppService";
import { PatientFooterSection } from "./sections/patientFooterSection";

@Injectable()
export class ReportSectionProvider {
    private _registeredReportSections: { [id: string]: IReportSection; } = {};

    constructor(private patientDemographicDataService: PatientDemographicDataService,
        private occupationalHistoryDataService: OccupationalHistoryDataService,
        private educationHistoryDataService: EducationHistoryDataService,
        private patientInsuranceDataService: PatientInsuranceDataService,
        private tobaccoHistoryDataService: TobaccoHistoryDataService,
        private companyIdService: CompanyIdService,
        private companyDataService: CompanyDataService,
        private appointmentGridViewDataService: AppointmentGridViewDataService,
        private drugHistoryDataService: DrugHistoryDataService,
        private alcoholHistoryDataService: AlcoholHistoryDataService,
        private medicalHistoryDataService: MedicalHistoryDataService,
        private surgicalHistoryDataService: SurgicalHistoryDataService,
        private familyHistoryDataService: FamilyHistoryDataService,
        private allergyDataService: AllergyDataService,
        private medicationHistoryDataService: MedicationHistoryDataService,
        private vitalSignsAppService: VitalSignsAppService,
        private templateDataService: TemplateDataService,
        private patienDataModelService: PatienDataModelService,
        private dataService: DataService,
        private toastService: ToastService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private defaultValuesProvider: DefaultValuesProvider,
        private medicalRecordDataService: MedicalRecordDataService,
        private signatureInfoAppService: SignatureInfoAppService) {

        this.registerReportSections();
    }

    getReportSectionHtml(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const sectionName = reportSectionInfo.templateName
            ? ReportSectionNames.templateSection
            : reportSectionInfo.sectionName;

        const reportSection = this
            ._registeredReportSections[sectionName];

        if (!reportSection) {
            return Promise.resolve("");
        }

        return reportSection
            .getHtmlString(reportSectionInfo);
    }

    private registerReportSections(): void {
        this.registerReportSection(ReportSectionNames.patientHeader,
            new PatientHeaderSection(this.patientDemographicDataService,
                this.patientInsuranceDataService, this.companyIdService, this.companyDataService,
                this.appointmentGridViewDataService));

        this.registerReportSection(ReportSectionNames.patientFooter,
            new PatientFooterSection(this.signatureInfoAppService));

        this.registerPatientHistorySections();

        this.registerReportSection(ReportSectionNames.chiefComplaint,
            new ChiefComplaintSection(this.patienDataModelService));

        this.registerReportSection(ReportSectionNames.vitalSigns,
            new VitalSignsSection(this.vitalSignsAppService));

        this.registerReportSection(ReportSectionNames.procedure,
            new ProcedureSection());

        this.registerReportSection(ReportSectionNames.assessment,
            new AssessmentSection(this.patienDataModelService));

        this.registerReportSection(ReportSectionNames.plan,
            new PlanSection());

        this.registerReportSection(ReportSectionNames.hpiSection,
            new HpiSection());

        this.registerReportSection(ReportSectionNames.templateSection,
            new TemplateSection(this.templateDataService,
                this.patienDataModelService, this.dataService, this.toastService,
                this.selectableItemHtmlService));

        this.registerReportSection(ReportSectionNames.rosSection,
            new RosSection());

        this.registerReportSection(ReportSectionNames.physicalExamSection,
            new PhysicalExamSection());
    }

    private registerReportSection(sectionName: string, reportSection: IReportSection): void {
        this._registeredReportSections[sectionName] = reportSection;
    }

    private registerPatientHistorySections(): void {
        this.registerReportSection(ReportSectionNames.tobaccoHistory,
            new TobaccoHistorySection(this.tobaccoHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.drugHistory,
            new DrugHistorySection(this.drugHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.alcoholHistory,
            new AlcoholHistorySection(this.alcoholHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.previousMedicalHistory,
            new PreviousMedicalHistorySection(this.medicalHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.previousSurgicalHistory,
            new PreviousSurgicalHistorySection(this.surgicalHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.familyHistory,
            new FamilyHistorySection(this.familyHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.education,
            new EducationSection(this.educationHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.occupationalHistory,
            new OccupationalHistorySection(this.occupationalHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.allergies,
            new AllergiesSection(this.allergyDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.medications,
            new MedicationsSection(this.medicationHistoryDataService,
                this.defaultValuesProvider));

        this.registerReportSection(ReportSectionNames.reviewedMedicalRecords,
            new ReviewedMedicalRecordsSection(this.medicalRecordDataService,
                this.defaultValuesProvider));
    }
}