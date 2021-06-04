import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { FamilyHistory } from '../../models/familyHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class FamilyHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<FamilyHistory[]>(`${this.config.apiUrl}familyhistory/patient/${patientId}`)
            .toPromise();
    }

    isHistoryExist(patientId: string) {
        return this.http.get<boolean>(`${this.config.apiUrl}familyhistory/historyexistence/patient/${patientId}`)
            .toPromise();
    }

    save(familyHistory: FamilyHistory) {
        familyHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(familyHistory.createDate);

        return this.http.post<void>(`${this.config.apiUrl}familyhistory`, familyHistory)
            .toPromise();
    }

    delete(familyHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}familyhistory/${familyHistoryId}`)
            .toPromise();
    }

    getById(familyHistoryId: any) {
        return this.http.get<FamilyHistory>(`${this.config.apiUrl}familyhistory/${familyHistoryId}`)
            .toPromise()
            .then(familyHistory => {
                if (familyHistory) {
                    familyHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(familyHistory.createDate);
                }

                return familyHistory;
            });
    }
}