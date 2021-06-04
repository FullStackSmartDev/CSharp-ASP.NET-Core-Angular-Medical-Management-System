import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { SignatureInfoAppService } from "../../appServices/signatureInfoAppService";

export class PatientFooterSection implements IReportSection {
    constructor(private signatureInfoAppService: SignatureInfoAppService) {

    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const admissionId = reportSectionInfo.admission.Id;
        return this.signatureInfoAppService
            .getSignatureString(admissionId)
            .then(signature => {
                return `
                    <hr>
                    <div><b>${signature}</b></div>`;
            });
    }
}