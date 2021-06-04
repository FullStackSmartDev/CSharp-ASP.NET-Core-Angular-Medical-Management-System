import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { SignatureInfoService } from '../../services/signature-info.service';

export class PatientFooterSection implements IReportSection {
    constructor(private signatureInfoService: SignatureInfoService) {

    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const admissionId = reportSectionInfo.admission.id;
        return this.signatureInfoService
            .getSignatureString(admissionId)
            .then(signature => {
                return `
                    <hr>
                    <div><b>${signature}</b></div>`;
            });
    }
}