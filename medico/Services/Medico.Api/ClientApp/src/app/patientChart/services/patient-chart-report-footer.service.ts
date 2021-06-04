import { SignatureInfoService } from './signature-info.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PatientChartReportFooterService {
    constructor(private signatureInfoService: SignatureInfoService) {

    }

    getPatientChartNodeReportContent(admissionId: string): Promise<string> {
        return this.signatureInfoService
            .getSignatureString(admissionId)
            .then(signature => {
                return `
                    <hr>
                    <div><b>${signature}</b></div>`;
            });
    }
}