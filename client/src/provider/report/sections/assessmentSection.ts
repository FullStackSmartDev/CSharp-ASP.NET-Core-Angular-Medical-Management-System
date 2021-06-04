import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { PatienDataModelService } from "../../patienDataModelService";
import { ReportSectionNames } from "../../../constants/reportSectionNames";

export class AssessmentSection implements IReportSection {
    constructor(private patienDataModelService: PatienDataModelService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientAdmissionModel =
            JSON.parse(reportSectionInfo.admission.AdmissionData).patientRoot;

        const assessments =
            this.getAssessments(patientAdmissionModel, reportSectionInfo.sectionName);

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
        const patientAdmissionSection = this.patienDataModelService
            .getPatientAdmissionSectionByName(sectionName, patientAdmissionModel);

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
                    <div><b>${assessment.Diagnosis}</b></div>
                    <div>${assessment.Notes}</div>
                </li>`;
        }

        return assessmentListItems;
    }
}