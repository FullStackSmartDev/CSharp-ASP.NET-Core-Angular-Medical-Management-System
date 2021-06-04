import { SignatureInfoService } from '../../services/signature-info.service';
import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';

export class PatientFooterSection implements IReportContentProvider {
    constructor(private signatureInfoService: SignatureInfoService) {

    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        const admissionId = patientChartNodeReportInfo.admissionId;
        return this.signatureInfoService
            .getSignatureString(admissionId)
            .then(signature => {
                return `
                    <hr>
                    <div><b>${signature}</b></div>`;
            });
    }
}