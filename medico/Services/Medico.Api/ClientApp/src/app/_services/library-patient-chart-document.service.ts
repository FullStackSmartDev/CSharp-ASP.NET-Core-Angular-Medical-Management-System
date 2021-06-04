import { BasePatientChartDocumentService } from './base-patient-chart-document.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root" })
export class LibraryPatientChartDocumentService extends BasePatientChartDocumentService {
    patientChartDocumentUrl: string = ApiBaseUrls.libraryPatientChartDocuments;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }
}