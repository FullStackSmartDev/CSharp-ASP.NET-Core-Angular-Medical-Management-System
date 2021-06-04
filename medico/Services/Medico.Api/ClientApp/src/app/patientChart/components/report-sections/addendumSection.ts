import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';
import { PatientChartNode } from 'src/app/_models/patientChartNode';

export class AddendumSection implements IReportContentProvider {
    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        const addendumNotes =
            this.getAddendumNotes(patientChartNodeReportInfo.patientChartNode);

        if (!addendumNotes)
            return Promise.resolve("");

        const allegationsTemplate = `
            <div style="margin-top:15px;line-height:1em;">
                <div><b>${patientChartNodeReportInfo.patientChartNode.title}:</b><div>
                <ul style="list-style-type:square;">${addendumNotes}</ul>
            </div>`;

        return Promise.resolve(allegationsTemplate);
    }

    getAddendumNotes(patientChartNode: PatientChartNode): string {
        return patientChartNode.value
            ? patientChartNode.value
            : "";
    }
}