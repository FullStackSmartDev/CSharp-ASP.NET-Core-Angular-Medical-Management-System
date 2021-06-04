import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Patient } from '../patients/models/patient';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { PatientSearchFilter } from '../_models/patientSearchFilter';

@Injectable({ providedIn: 'root' })
export class PatientService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    updatePatientNotes(patientId: string, notes: string): Promise<any> {
        const patchObject = [];

        patchObject.push({
            "op": "add",
            "path": "/id",
            "value": patientId
        });

        patchObject.push({
            "op": "add",
            "path": "/notes",
            "value": notes
        });

        return this.http.patch(`${this.config.apiUrl}${ApiBaseUrls.patient}`, patchObject)
            .toPromise();
    }

    save(patient: Patient): Promise<Patient> {
        patient.dateOfBirth = DateHelper.jsLocalDateToSqlServerUtc(patient.dateOfBirth);
        return this.http.post<Patient>(`${this.config.apiUrl}${ApiBaseUrls.patient}/`, patient)
            .toPromise();
    }

    getById(id: string): Promise<Patient> {
        return this.http.get<Patient>(`${this.config.apiUrl}${ApiBaseUrls.patient}/${id}`)
            .toPromise()
            .then(patient => {
                if (patient)
                    patient.dateOfBirth = DateHelper.sqlServerUtcDateToLocalJsDate(patient.dateOfBirth);

                return patient;
            });
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${ApiBaseUrls.patient}/${id}`)
            .toPromise();
    }

    getByFilter(patientSearchFilter: PatientSearchFilter): Promise<Patient[]> {
        const queryParams = new HttpParams({
            fromObject: patientSearchFilter.toQueryParams()
        });
        return this.http.get<Patient[]>(`${this.config.apiUrl}${ApiBaseUrls.patient}`, { params: queryParams })
            .toPromise();
    }
}