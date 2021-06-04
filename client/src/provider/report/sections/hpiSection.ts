import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";

export class HpiSection implements IReportSection {
    constructor() {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const sectionContent = `
            <div style="margin-top: 10px;" id="${ReportSectionNames.hpiSection}">
                <div><b>History Of Present Illness</b></div>
            </div>`;

        return Promise.resolve(sectionContent);
    }
}