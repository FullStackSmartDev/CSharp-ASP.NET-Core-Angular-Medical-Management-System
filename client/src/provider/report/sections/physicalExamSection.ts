import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";

export class PhysicalExamSection implements IReportSection {
    constructor() {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const sectionContent = `
            <div style="margin-top:15px;" id="${ReportSectionNames.physicalExamSection}">
                <div><b>Physical Exam</b></div>
            </div>`;

        return Promise.resolve(sectionContent);
    }
}