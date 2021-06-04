import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Patient } from '../patients/models/patient';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable({ providedIn: 'root' })
export class PatientService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    save(patient: Patient): Promise<Patient> {
        patient.dateOfBirth = DateHelper.jsLocalDateToSqlServerUtc(patient.dateOfBirth);
        return this.http.post<Patient>(`${this.config.apiUrl}patient/`, patient)
            .toPromise();
    }

    getById(id: string): Promise<Patient> {
        return this.http.get<Patient>(`${this.config.apiUrl}patient/${id}`)
            .toPromise()
            .then(patient => {
                if (patient)
                    patient.dateOfBirth = DateHelper.sqlServerUtcDateToLocalJsDate(patient.dateOfBirth);

                return patient;
            });
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}patient/${id}`)
            .toPromise();
    }
}