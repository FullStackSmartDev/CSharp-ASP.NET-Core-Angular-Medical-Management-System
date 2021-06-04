import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";

export class ProcedureSection implements IReportSection {
    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const procedureSectionTemplate = "";
        // const procedureSectionTemplate = `
        //     <div style="margin-top: 10px;" id="${ReportSectionNames.procedure}">
        //         Procedure
        //     </div>`;
        return Promise.resolve(procedureSectionTemplate);
    }
}