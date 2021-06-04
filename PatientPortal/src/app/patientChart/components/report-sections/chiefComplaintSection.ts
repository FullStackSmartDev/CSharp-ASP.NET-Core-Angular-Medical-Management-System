import { ReportSectionInfo, IReportSection } from "./baseHistoryReportSection";
import { PatientChartService } from '../../services/patient-chart.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';

export class ChiefComplaintSection implements IReportSection {
    constructor(private patientChartService: PatientChartService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientAdmissionModel = JSON
            .parse(reportSectionInfo.admission.admissionData).patientRoot;

        const allegations = this.getAllegations(patientAdmissionModel, reportSectionInfo.sectionName);

        if (!allegations) {
            return Promise.resolve("");
        }

        const allegationsTemplate = `
            <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.chiefComplaint}">
                <div><b>Allegations:</b><div>
                <ul style="list-style-type:square;">${allegations}</ul>
            </div>`;

        return Promise.resolve(allegationsTemplate);
    }

    private getAllegations(patientAdmissionModel: any, sectionName: string): string {
        const patientChartSection = this.patientChartService
            .getPatientChartSectionByName(sectionName, patientAdmissionModel);

        const patientAdmissionSectionValue = patientChartSection.value;

        if (!patientAdmissionSectionValue) {
            return "";
        }

        const patientAllegationsSets = patientAdmissionSectionValue.patientAllegationsSets;

        if (patientAllegationsSets && patientAllegationsSets.length) {
            let allegations = "";

            for (let i = 0; i < patientAllegationsSets.length; i++) {
                const patientAllegationsSet = patientAllegationsSets[i];

                allegations += `<li><p>${patientAllegationsSet.allegations}</p></li>`;
            }

            return allegations;
        }
        return "";
    }
}