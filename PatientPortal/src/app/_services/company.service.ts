import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../_models/company';
import { ConfigService } from 'src/app/_services/config.service';
import { PatientChartConfig } from '../_models/patientChartConfig';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getPatientChartConfig(companyId: string): Promise<any> {
        return this.http.get<PatientChartConfig>(`${this.config.apiUrl}company/patient-chart-config/${companyId}`)
            .toPromise()
            .then((patientChartConfig) => {
                return JSON.parse(patientChartConfig.patientChartJsonConfig);
            })
    }

    getPatientChartConfigFullInfo(companyId: string): Promise<PatientChartConfig> {
        return this.http.get<PatientChartConfig>(`${this.config.apiUrl}company/patient-chart-config/${companyId}`)
            .toPromise();
    }

    updatePatientChartConfig(patientChartConfig: PatientChartConfig): Promise<PatientChartConfig> {
        return this.http.post<PatientChartConfig>(`${this.config.apiUrl}company/patient-chart-config/`, patientChartConfig)
            .toPromise();
    }

    getFirst(): Promise<Company> {
        return this.http.get<Company>(`${this.config.apiUrl}company/first`)
            .toPromise();
    }

    getByAppointmentId(appointmentId: string): Promise<Company> {
        return this.http.get<Company>(`${this.config.apiUrl}company/appointment/${appointmentId}`)
            .toPromise();
    }

    getById(id: string): Promise<Company> {
        return this.http.get<Company>(`${this.config.apiUrl}company/${id}`)
            .toPromise();
    }

    save(company: Company): Promise<Company> {
        return this.http.post<Company>(`${this.config.apiUrl}company/`, company)
            .toPromise();
    }
}