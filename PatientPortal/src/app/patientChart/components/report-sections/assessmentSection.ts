import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { PatientChartService } from '../../services/patient-chart.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';

export class AssessmentSection implements IReportSection {
    constructor(private patientChartService: PatientChartService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientChartTree = JSON.parse(reportSectionInfo.admission.admissionData).patientRoot;
        const assessments = this.getAssessments(patientChartTree, reportSectionInfo.sectionName);

        if (!assessments) {
            return Promise.resolve("");
        }

        const assessmentsTemplate = `
            <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.assessment}">
                <div><b>Assessment:</b><div>
                <ul style="list-style-type:square;">${assessments}</ul>
            </div>`;

        return Promise.resolve(assessmentsTemplate);
    }

    private getAssessments(patientAdmissionModel: any, sectionName: string): string {
        const patientAdmissionSection = this.patientChartService
            .getPatientChartSectionByName(sectionName, patientAdmissionModel);

        const assessments =
            patientAdmissionSection.value;

        if (!assessments || !assessments.length) {
            return "";
        }

        let assessmentListItems = "";

        for (let i = 0; i < assessments.length; i++) {
            const assessment = assessments[i];
            if (assessment.IsDelete) {
                continue;
            }

            assessmentListItems += `
                <li>
                    <div><b>${assessment.diagnosis}</b></div>
                    <div>${assessment.notes ? assessment.notes : ""}</div>
                </li>`;
        }

        return assessmentListItems;
    }
}