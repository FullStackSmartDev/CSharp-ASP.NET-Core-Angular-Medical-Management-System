import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';
import { PatientChartNode } from 'src/app/_models/patientChartNode';

export class AssessmentSection implements IReportContentProvider {
    constructor() {
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        const assessments =
            this.getAssessments(patientChartNodeReportInfo.patientChartNode);

        if (!assessments) {
            return Promise.resolve("");
        }

        const assessmentsTemplate = `
            <div style="margin-top:15px;line-height:1em;">
                <div><b>Assessment:</b><div>
                <ul style="list-style-type:square;">${assessments}</ul>
            </div>`;

        return Promise.resolve(assessmentsTemplate);
    }

    private getAssessments(assessmentsPatientChartNode: PatientChartNode): string {
        const assessments =
            assessmentsPatientChartNode.value;

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