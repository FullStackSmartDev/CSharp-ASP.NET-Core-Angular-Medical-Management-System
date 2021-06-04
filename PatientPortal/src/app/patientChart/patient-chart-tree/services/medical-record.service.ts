import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { MedicalRecord } from '../../models/medicalRecord';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class MedicalRecordService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<MedicalRecord[]>(`${this.config.apiUrl}medicalrecord/patient/${patientId}`)
            .toPromise();
    }

    isHistoryExist(patientId: string) {
        return this.http.get<boolean>(`${this.config.apiUrl}medicalrecord/historyexistence/patient/${patientId}`)
            .toPromise();
    }

    save(medicalRecord: MedicalRecord) {
        medicalRecord.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(medicalRecord.createDate);

        return this.http.post<void>(`${this.config.apiUrl}medicalrecord`, medicalRecord)
            .toPromise();
    }

    delete(medicalRecordId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}medicalrecord/${medicalRecordId}`)
            .toPromise();
    }

    getById(medicalRecordId: any) {
        return this.http.get<MedicalRecord>(`${this.config.apiUrl}medicalrecord/${medicalRecordId}`)
            .toPromise()
            .then(medicalRecord => {
                if (medicalRecord) {
                    medicalRecord.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(medicalRecord.createDate);
                }

                return medicalRecord;
            });
    }
}