import { BasePatientChartHttpService } from './base-patient-chart-http.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: "root" })
export class LibraryPatientChartHttpService extends BasePatientChartHttpService {
    patientChartUrl: string = ApiBaseUrls.libraryPatientChart;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }
}
