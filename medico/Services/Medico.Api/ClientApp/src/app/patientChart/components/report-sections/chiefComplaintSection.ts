import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';
import { PatientChartNode } from 'src/app/_models/patientChartNode';

export class ChiefComplaintSection implements IReportContentProvider {
    constructor() {
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        const allegations = this.getAllegations(patientChartNodeReportInfo.patientChartNode);

        if (!allegations)
            return Promise.resolve("");

        const allegationsTemplate = `
            <div style="margin-top:15px;line-height:1em;">
                <div><b>Allegations:</b><div>
                <ul style="list-style-type:square;">${allegations}</ul>
            </div>`;

        return Promise.resolve(allegationsTemplate);
    }

    private getAllegations(allegationsPatientChartNode: PatientChartNode): string {
        const patientAdmissionSectionValue =
            allegationsPatientChartNode.value;

        if (!patientAdmissionSectionValue)
            return "";

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