import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";

export class PlanSection implements IReportSection {
    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const planSectionTemplate = `
            <div style="margin-top:10px;" id="${ReportSectionNames.plan}">
                <div><b>Plan</b></div>
            </div>`;
        return Promise.resolve(planSectionTemplate);
    }
}