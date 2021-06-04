import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { DrugHistory } from '../../models/drugHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class DrugHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<DrugHistory[]>(`${this.config.apiUrl}drughistory/patient/${patientId}`)
            .toPromise();
    }

    getLastCreated(patientId: string): Promise<DrugHistory> {
        return this.http.get<DrugHistory>(`${this.config.apiUrl}drughistory/last/patient/${patientId}`)
            .toPromise();
    }

    save(drugHistory: DrugHistory) {
        drugHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(drugHistory.createDate);
            
        return this.http.post<void>(`${this.config.apiUrl}drughistory`, drugHistory)
            .toPromise();
    }

    delete(drugHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}drughistory/${drugHistoryId}`)
            .toPromise();
    }

    getById(drugHistoryId: any) {
        return this.http.get<DrugHistory>(`${this.config.apiUrl}drughistory/${drugHistoryId}`)
            .toPromise()
            .then(drugHistory => {
                if (drugHistory) {
                    drugHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(drugHistory.createDate);
                }

                return drugHistory;
            });
    }
}