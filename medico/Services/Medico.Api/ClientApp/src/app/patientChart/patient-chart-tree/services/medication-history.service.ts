import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { MedicationHistory } from '../../models/medicationHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class MedicationHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<MedicationHistory[]>(`${this.config.apiUrl}medicationhistory/patient/${patientId}`)
            .toPromise();
    }

    isHistoryExist(patientId: string) {
        return this.http.get<boolean>(`${this.config.apiUrl}medicationhistory/historyexistence/patient/${patientId}`)
            .toPromise();
    }

    save(medicationHistory: MedicationHistory) {
        medicationHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(medicationHistory.createDate);

        return this.http.post<void>(`${this.config.apiUrl}medicationhistory`, medicationHistory)
            .toPromise();
    }

    delete(medicationHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}medicationhistory/${medicationHistoryId}`)
            .toPromise();
    }

    getById(medicationHistoryId: any) {
        return this.http.get<MedicationHistory>(`${this.config.apiUrl}medicationhistory/${medicationHistoryId}`)
            .toPromise()
            .then(medicationHistory => {
                if (medicationHistory) {
                    medicationHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(medicationHistory.createDate);
                }

                return medicationHistory;
            });
    }
}