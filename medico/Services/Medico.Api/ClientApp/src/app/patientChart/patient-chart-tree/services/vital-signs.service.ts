import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { VitalSigns } from '../../models/vitalSigns';

@Injectable()
export class VitalSignsService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getLast(patientId: string, createDate: any) {
        const serverDate = DateHelper.jsLocalDateToSqlServerUtc(createDate);
        return this.http.get<VitalSigns>(`${this.config.apiUrl}vitalsigns/last/patient/${patientId}/date/${serverDate}`)
            .toPromise();
    }

    save(vitalSigns: VitalSigns) {
        vitalSigns.createDate = DateHelper.jsLocalDateToSqlServerUtc(vitalSigns.createDate);
        return this.http.post<void>(`${this.config.apiUrl}vitalsigns`, vitalSigns)
            .toPromise();
    }

    delete(vitalSignsId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}vitalsigns/${vitalSignsId}`).toPromise();
    }

    getById(vitalSignsId: any) {
        return this.http.get<VitalSigns>(`${this.config.apiUrl}vitalsigns/${vitalSignsId}`)
            .toPromise()
            .then(vitalSigns => {
                if (vitalSigns) {
                    vitalSigns.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(vitalSigns.createDate);
                }

                return vitalSigns;
            });
    }

    getByPatientAndAdmissionIds(patientId: string, admissionId: string): Promise<VitalSigns[]> {
        return this.http.get<VitalSigns[]>(`${this.config.apiUrl}vitalsigns/patient/${patientId}/admission/${admissionId}`)
            .toPromise()
            .then(vitalSignsList => {
                vitalSignsList.forEach(vitalSigns => {
                    vitalSigns.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(vitalSigns.createDate);
                });

                return vitalSignsList;
            });
    }
}