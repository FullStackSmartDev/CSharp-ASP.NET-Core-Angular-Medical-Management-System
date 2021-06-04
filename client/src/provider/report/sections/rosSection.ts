import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";

export class RosSection implements IReportSection {
    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const sectionContent = `
            <div style="margin-top: 10px;" id="${ReportSectionNames.rosSection}">
                <div><b>Review Of System</b></div>
            </div>`;

        return Promise.resolve(sectionContent);
    }
}