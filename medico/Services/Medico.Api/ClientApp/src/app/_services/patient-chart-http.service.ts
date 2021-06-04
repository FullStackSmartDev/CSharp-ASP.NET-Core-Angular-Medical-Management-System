import { BasePatientChartHttpService } from './base-patient-chart-http.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: "root" })
export class PatientChartHttpService extends BasePatientChartHttpService {
    patientChartUrl: string = ApiBaseUrls.patientChart;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }
}