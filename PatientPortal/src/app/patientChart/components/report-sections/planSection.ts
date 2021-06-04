import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { ReportSectionNames } from '../../classes/reportSectionNames';

export class PlanSection implements IReportSection {
    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const planSectionTemplate = `
            <div style="margin-top:10px;" id="${ReportSectionNames.plan}">
                <div><b>Plan</b></div>
            </div>`;
        return Promise.resolve(planSectionTemplate);
    }
}