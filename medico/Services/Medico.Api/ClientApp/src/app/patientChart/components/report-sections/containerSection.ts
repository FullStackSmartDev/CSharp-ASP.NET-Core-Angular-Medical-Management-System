import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';
//this section is used fo DocumentNode, SectionNode, TemplateListNode types
export class ContainerSection implements IReportContentProvider {
    constructor() {
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo)
        : Promise<string> {
        const sectionContent = `
            <div style="margin-top: 10px;">
                <div><b>${patientChartNodeReportInfo.patientChartNode.title}</b></div>
            </div>`;

        return Promise.resolve(sectionContent);
    }
}