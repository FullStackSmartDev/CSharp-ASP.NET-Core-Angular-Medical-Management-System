import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { TobaccoHistory } from '../../models/tobaccoHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class TobaccoHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getLastCreated(patientId: string): Promise<TobaccoHistory> {
        return this.http.get<TobaccoHistory>(`${this.config.apiUrl}tobaccohistory/last/patient/${patientId}`)
            .toPromise();
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<TobaccoHistory[]>(`${this.config.apiUrl}tobaccohistory/patient/${patientId}`)
            .toPromise();
    }

    save(tobaccoHistory: TobaccoHistory) {
        tobaccoHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(tobaccoHistory.createDate);

        return this.http.post<void>(`${this.config.apiUrl}tobaccohistory`, tobaccoHistory)
            .toPromise();
    }

    delete(tobaccoHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}tobaccohistory/${tobaccoHistoryId}`)
            .toPromise();
    }

    getById(tobaccoHistoryId: any) {
        return this.http.get<TobaccoHistory>(`${this.config.apiUrl}tobaccohistory/${tobaccoHistoryId}`)
            .toPromise()
            .then(tobaccoHistory => {
                if (tobaccoHistory) {
                    tobaccoHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(tobaccoHistory.createDate);
                }

                return tobaccoHistory;
            });
    }
}